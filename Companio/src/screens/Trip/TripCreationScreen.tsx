import React, { useState } from "react";
import { StyleSheet, ScrollView, View, TouchableOpacity } from "react-native";
import { Button, Text, TextInput, HelperText, Menu } from "react-native-paper";
import PageLayout from "../../components/common/PageLayout";
import { Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../types/navigation";
import { StackNavigationProp } from "@react-navigation/stack";
import LottieView from "lottie-react-native";
import { showToast } from "../../utils/toast";
import api from "../../services/api";
import { Trip, ApiResponse } from "../../types/api";

interface TripFormValues {
  title: string;
  description: string;
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelMode: string;
  budgetAmount: string;
  budgetCurrency: string;
}

const TripCreationSchema = Yup.object().shape({
  title: Yup.string().required("Trip title is required"),
  origin: Yup.string().required("Origin is required"),
  destination: Yup.string().required("Destination is required"),
  startDate: Yup.string().required("Start date is required"),
  endDate: Yup.string().required("End date is required"),
  travelMode: Yup.string().required("Travel mode is required"),
  budgetAmount: Yup.number()
    .typeError("Budget must be a number")
    .positive("Budget must be positive")
    .required("Budget is required"),
  budgetCurrency: Yup.string().required("Currency is required"),
});

const TripCreationScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [travelModeMenuVisible, setTravelModeMenuVisible] =
    useState<boolean>(false);
  const [budgetCurrencyMenuVisible, setBudgetCurrencyMenuVisible] =
    useState<boolean>(false);

  const initialValues: TripFormValues = {
    title: "",
    description: "",
    origin: "",
    destination: "",
    startDate: "",
    endDate: "",
    travelMode: "",
    budgetAmount: "",
    budgetCurrency: "USD",
  };

  const handleSubmit = async (
    values: TripFormValues,
    { setSubmitting, resetForm }: FormikHelpers<TripFormValues>
  ) => {
    try {
      const tripData: Partial<Trip> = {
        title: values.title,
        description: values.description,
        origin: values.origin,
        destination: values.destination,
        startDate: values.startDate,
        endDate: values.endDate,
        travelMode: values.travelMode,
        budget: {
          amount: parseFloat(values.budgetAmount),
          currency: values.budgetCurrency,
        },
      };

      const response = await api.post<ApiResponse<Trip>>("/trips", tripData);
      if (response.data.success) {
        setShowSuccess(true);
        resetForm();
        showToast(
          "success",
          "Trip Created",
          "Your trip has been successfully created!"
        );
        setTimeout(() => {
          setShowSuccess(false);
          navigation.navigate("Dashboard");
        }, 3000);
      } else {
        showToast(
          "error",
          "Error",
          response.data.message || "Failed to create trip."
        );
      }
    } catch (error: any) {
      console.error("Trip creation error:", error);
      showToast("error", "Error", error.message || "Failed to create trip.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageLayout title="Create Trip">
      <ScrollView contentContainerStyle={styles.container}>
        {showSuccess && (
          <LottieView
            source={require("../../assets/animations/success.json")}
            autoPlay
            loop={false}
            style={styles.animation}
          />
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={TripCreationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
          }) => (
            <View>
              {/* Form fields go here */}
              {/* ... */}
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={isSubmitting}
                style={styles.submitButton}
              >
                {isSubmitting ? "Submitting..." : "Create Trip"}
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </PageLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  submitButton: {
    marginTop: 20,
    padding: 5,
  },
  animation: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
  },
});

export default TripCreationScreen;
