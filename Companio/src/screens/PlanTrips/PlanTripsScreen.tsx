import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Text, Button } from "react-native-paper";
import { useFormik } from "formik";
import * as Yup from "yup";
import FormikTextInput from "../../components/common/FormikTextInput";
import { useCreateTripMutation } from "../../api/authApi";
import { useNavigation } from "@react-navigation/native";
import { showErrorToast, showSuccessToast } from "../../utils/toast";

const PlanTripsSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  origin: Yup.string().required("Origin is required"),
  destination: Yup.string().required("Destination is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date can't be before start date"),
  travelMode: Yup.string().required("Travel mode is required"),
  budget: Yup.number()
    .required("Budget is required")
    .positive("Must be positive"),
});

const PlanTripsScreen: React.FC = () => {
  const [createTrip, { isLoading }] = useCreateTripMutation();
  const navigation = useNavigation();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      origin: "",
      destination: "",
      startDate: "",
      endDate: "",
      travelMode: "",
      budget: "",
    },
    validationSchema: PlanTripsSchema,
    onSubmit: async (values) => {
      try {
        await createTrip({
          ...values,
          budget: {
            amount: parseFloat(values.budget),
            currency: "USD",
          },
        }).unwrap();
        showSuccessToast(
          "Trip Created",
          "Your trip has been created successfully."
        );
        navigation.navigate("Dashboard");
      } catch (error: any) {
        showErrorToast(
          "Creation Failed",
          error?.data?.message || "Please try again."
        );
      }
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Plan a New Trip
      </Text>
      <FormikTextInput
        name="title"
        label="Title"
        accessibilityLabel="Title Input"
      />
      <FormikTextInput
        name="description"
        label="Description"
        accessibilityLabel="Description Input"
        multiline
        numberOfLines={3}
      />
      <FormikTextInput
        name="origin"
        label="Origin"
        accessibilityLabel="Origin Input"
      />
      <FormikTextInput
        name="destination"
        label="Destination"
        accessibilityLabel="Destination Input"
      />
      <FormikTextInput
        name="startDate"
        label="Start Date (YYYY-MM-DD)"
        keyboardType="numeric"
        accessibilityLabel="Start Date Input"
      />
      <FormikTextInput
        name="endDate"
        label="End Date (YYYY-MM-DD)"
        keyboardType="numeric"
        accessibilityLabel="End Date Input"
      />
      <FormikTextInput
        name="travelMode"
        label="Travel Mode"
        accessibilityLabel="Travel Mode Input"
      />
      <FormikTextInput
        name="budget"
        label="Budget"
        keyboardType="numeric"
        accessibilityLabel="Budget Input"
      />
      <Button
        onPress={() => formik.handleSubmit()}
        mode="contained"
        loading={isLoading}
        accessibilityLabel="Create Trip Button"
      >
        Create Trip
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
});

export default PlanTripsScreen;
