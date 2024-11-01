import { Skeleton, VStack } from "native-base";
import React from "react";

export default function SkeletonLoader() {
  return (
    <VStack space={4} alignItems="center">
      <Skeleton.Text lines={3} />
      <Skeleton h="20" w="80%" rounded="md" />
      <Skeleton.Text lines={2} w="80%" />
    </VStack>
  );
}
