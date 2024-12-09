import React, { useState, useEffect } from "react";
import { Text, StyleSheet, View } from "react-native";
import { Actionsheet, Box, Button, useToast } from "native-base";
import { Calendar } from "react-native-calendars";
import { useGlobalState } from "@/contexts/GlobalProvider";
import { SCREEN_WIDTH } from "@/constants/Device";
import LottieView from "lottie-react-native";

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
  const toast = useToast();

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

    if ((selectedTab === "service" && serviceStartDate && !serviceEndDate) ||
      (selectedTab === "order" && orderStartDate && !orderEndDate)) {
      setTempEndDate(null);
    }
  }, [isOpen, selectedTab, serviceStartDate, serviceEndDate, orderStartDate, orderEndDate]);

  const onDayPress = (day: any) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(day.dateString);
      setTempEndDate(null);
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
    const formatDateString = (date: string | null) => {
      return date ? new Date(date).toISOString().split("T")[0] : null;
    };

    if (selectedTab === "service") {
      setServiceStartDate(tempStartDate ? formatDateString(tempStartDate) : null);
      setServiceEndDate(tempEndDate ? formatDateString(tempEndDate) : tempStartDate ? formatDateString(tempStartDate) : null);
    } else {
      setOrderStartDate(tempStartDate ? formatDateString(tempStartDate) : null);
      setOrderEndDate(tempEndDate ? formatDateString(tempEndDate) : tempStartDate ? formatDateString(tempStartDate) : null);
    }
    toast.show({
      duration: 2300,
      placement: 'top',
      render: () => {
        return <Box
          borderTopColor='#16a34a'
          borderTopWidth={5} bg="#bbf7d0"
          alignSelf='center'
          px="2"
          py="1"
          rounded="sm"
          mb={5}
          style={{ flexDirection: 'column', width: '98%', justifyContent: 'center' }}
        >
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#bbf7d0',
            marginHorizontal: 30,
            flexDirection: 'row'
          }}>
            <LottieView
              source={require('@/assets/animations/success.json')}
              autoPlay
              loop
              style={{ width: 52, height: 52 }}
            />
            <Text
              style={{
                fontSize: 18,
                color: '#112D4E',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
              Áp dụng bộ lọc thành công!
            </Text>
          </View>
        </Box>;
      }
    });
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
    toast.show({
      duration: 2300,
      placement: 'top',
      render: () => {
        return <Box
          borderTopColor='#16a34a'
          borderTopWidth={5} bg="#bbf7d0"
          alignSelf='center'
          px="2"
          py="1"
          rounded="sm"
          mb={5}
          style={{ flexDirection: 'column', width: '98%', justifyContent: 'center' }}
        >
          <View style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#bbf7d0',
            marginHorizontal: 30,
            flexDirection: 'row'
          }}>
            <LottieView
              source={require('@/assets/animations/success.json')}
              autoPlay
              loop
              style={{ width: 52, height: 52 }}
            />
            <Text
              style={{
                fontSize: 18,
                color: '#112D4E',
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
              Xóa bộ lọc thành công!
            </Text>
          </View>
        </Box>;
      }
    });
    onClose();
  };

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

  const currentDate = new Date().toISOString().split("T")[0];

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content style={styles.sheetContent}>
        <Text style={styles.title}>Chọn khoảng ngày</Text>
        <Calendar
          current={initialMonth}
          markingType={"period"}
          markedDates={markedDates}
          onDayPress={onDayPress}
          maxDate={currentDate}
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
