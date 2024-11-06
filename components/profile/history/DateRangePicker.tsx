// src/components/profile/history/DateRangePicker.tsx
import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Actionsheet, Button } from "native-base";
import { Calendar } from "react-native-calendars";
import { useGlobalState } from "../../../contexts/GlobalProvider";
import { SCREEN_WIDTH } from "../../../constants/Device";

const DateRangePicker = ({ isOpen, onClose, selectedTab }: { isOpen: boolean; onClose: () => void; selectedTab: "service" | "order" }) => {
  const {
    serviceStartDate, setServiceStartDate,
    serviceEndDate, setServiceEndDate,
    orderStartDate, setOrderStartDate,
    orderEndDate, setOrderEndDate
  } = useGlobalState();

  const [tempStartDate, setTempStartDate] = useState<string | null>(null);
  const [tempEndDate, setTempEndDate] = useState<string | null>(null);
  const [initialMonth, setInitialMonth] = useState<string | undefined>(undefined);

  // Khởi tạo khi mở bộ lọc, đảm bảo tính nhất quán của ngày bắt đầu và ngày kết thúc
  useEffect(() => {
    if (selectedTab === "service") {
      setTempStartDate(serviceStartDate ? serviceStartDate.toISOString().split("T")[0] : null);
      setTempEndDate(serviceEndDate ? serviceEndDate.toISOString().split("T")[0] : null);
      setInitialMonth(serviceStartDate ? serviceStartDate.toISOString().split("T")[0] : undefined);
    } else {
      setTempStartDate(orderStartDate ? orderStartDate.toISOString().split("T")[0] : null);
      setTempEndDate(orderEndDate ? orderEndDate.toISOString().split("T")[0] : null);
      setInitialMonth(orderStartDate ? orderStartDate.toISOString().split("T")[0] : undefined);
    }

    // Đảm bảo tempEndDate là null nếu chỉ có ngày bắt đầu
    if ((selectedTab === "service" && serviceStartDate && !serviceEndDate) ||
      (selectedTab === "order" && orderStartDate && !orderEndDate)) {
      setTempEndDate(null);
    }
  }, [isOpen, selectedTab, serviceStartDate, serviceEndDate, orderStartDate, orderEndDate]);

  const onDayPress = (day: any) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(day.dateString);
      setTempEndDate(null); // Reset ngày kết thúc nếu đã có
    } else {
      const start = new Date(tempStartDate);
      const end = new Date(day.dateString);

      if (end > start) {
        setTempEndDate(day.dateString);
      } else {
        setTempEndDate(tempStartDate);
        setTempStartDate(day.dateString);
      }
    }
  };

  const applyDateFilter = () => {
    if (selectedTab === "service") {
      setServiceStartDate(tempStartDate ? new Date(tempStartDate) : null);
      setServiceEndDate(tempEndDate ? new Date(tempEndDate) : tempStartDate ? new Date(tempStartDate) : null);
    } else {
      setOrderStartDate(tempStartDate ? new Date(tempStartDate) : null);
      setOrderEndDate(tempEndDate ? new Date(tempEndDate) : tempStartDate ? new Date(tempStartDate) : null);
    }
    onClose();
  };

  const clearDateFilter = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    if (selectedTab === "service") {
      setServiceStartDate(null);
      setServiceEndDate(null);
    } else {
      setOrderStartDate(null);
      setOrderEndDate(null);
    }
  };

  // Đánh dấu ngày trên lịch
  const markedDates: { [key: string]: any } = {};
  if (tempStartDate && !tempEndDate) {
    markedDates[tempStartDate] = { selected: true, color: "#3F72AF", textColor: "white", borderRadius: 50 };
  } else if (tempStartDate && tempEndDate) {
    markedDates[tempStartDate] = { startingDay: true, color: "#3F72AF", textColor: "white" };
    markedDates[tempEndDate] = { endingDay: true, color: "#3F72AF", textColor: "white" };

    let currentDate = new Date(tempStartDate);
    const endDate = new Date(tempEndDate);

    while (currentDate < endDate) {
      currentDate.setDate(currentDate.getDate() + 1);
      const dateString = currentDate.toISOString().split("T")[0];
      if (dateString !== tempEndDate) {
        markedDates[dateString] = { color: "#B0C4DE", textColor: "white" };
      }
    }
  }

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content style={styles.sheetContent}>
        <Text style={styles.title}>Chọn khoảng ngày</Text>
        <Calendar
          current={initialMonth}
          markingType={"period"}
          markedDates={markedDates}
          onDayPress={onDayPress}
          style={styles.calendar}
        />
        <View style={styles.buttonContainer}>
          <Button onPress={clearDateFilter} style={styles.clearButton}>Xoá Bộ Lọc</Button>
          <Button onPress={applyDateFilter} style={styles.applyButton}>Áp Dụng</Button>
        </View>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    backgroundColor: "#DBE2EF",
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  calendar: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_WIDTH * 0.80,
    borderRadius: 16,
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 16,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#d9534f",
    marginRight: 8,
  },
  applyButton: {
    flex: 1,
    backgroundColor: "#3F72AF",
  },
});

export default DateRangePicker;
