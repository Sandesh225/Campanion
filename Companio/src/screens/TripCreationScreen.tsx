// src/screens/TripCreationScreen.tsx

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  HelperText,
  Chip,
  IconButton,
  Text,
  useTheme,
  Menu,
} from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import DropDownPicker from "react-native-dropdown-picker";
import { PieChart } from "react-native-chart-kit";
import LottieView from "lottie-react-native";
import styled from "styled-components/native";
import TravelModeToggle from "../components/TravelModeToggle";
import MilestoneChips from "../components/MilestoneChips";
import BudgetChart from "../components/BudgetChart";

// Define types for form values
interface TripFormValues {
  title: string;
  description: string;
  origin: string;
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  travelMode: string;
  budgetAmount: string;
  budgetCurrency: string;
  activities: string[];
  dietaryRestrictions: string[];
  communicationPreferences: string[];
  milestones: string[];
}

// Validation schema using Yup
const TripSchema = Yup.object().shape({
  title: Yup.string().required("Trip title is required"),
  description: Yup.string(),
  origin: Yup.string().required("Origin is required"),
  destination: Yup.string().required("Destination is required"),
  startDate: Yup.date().required("Start date is required").nullable(),
  endDate: Yup.date()
    .required("End date is required")
    .nullable()
    .min(Yup.ref("startDate"), "End date cannot be before start date"),
  travelMode: Yup.string().required("Select a travel mode"),
  budgetAmount: Yup.number()
    .typeError("Budget must be a number")
    .positive("Budget must be positive")
    .required("Budget is required"),
  budgetCurrency: Yup.string().required("Currency is required"),
  activities: Yup.array().min(1, "Select at least one activity"),
  dietaryRestrictions: Yup.array(),
  communicationPreferences: Yup.array(),
  milestones: Yup.array(),
});

// Sample data for dropdowns and multi-selects
const originOptions = [
  { label: "Home", value: "home" },
  { label: "New York", value: "new_york" },
  { label: "London", value: "london" },
  // Add more as needed
];

const destinationOptions = [
  { label: "Paris", value: "paris" },
  { label: "Tokyo", value: "tokyo" },
  { label: "Sydney", value: "sydney" },
  // Add more as needed
];

const currencyOptions = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  // Add more as needed
];

const activitiesOptions = [
  { label: "Hiking", value: "hiking" },
  { label: "Sightseeing", value: "sightseeing" },
  { label: "Relaxation", value: "relaxation" },
  // Add more as needed
];

const dietaryOptions = [
  { label: "Vegan", value: "vegan" },
  { label: "Gluten-Free", value: "gluten_free" },
  { label: "Kosher", value: "kosher" },
  // Add more as needed
];

const communicationOptions = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "Mandarin", value: "mandarin" },
  // Add more as needed
];

// Styled Components
const Container = styled(ScrollView)`
  flex: 1;
  background: linear-gradient(180deg, #87ceeb 0%, #ffffff 100%);
`;

const FormContainer = styled(View)`
  padding: 16px;
`;

const Section = styled(View)`
  margin-bottom: 24px;
`;

const Label = styled(Text)`
  margin-bottom: 8px;
  font-weight: bold;
`;

const CreateTripButton = styled(Button)`
  margin: 16px;
  background-color: #f9a826;
`;

const TripCreationScreen = () => {
  const theme = useTheme();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [milestones, setMilestones] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Function to generate milestones based on travel mode and destination
  const generateMilestones = (values: TripFormValues) => {
    const newMilestones: string[] = [];

    if (values.travelMode === "plane") {
      newMilestones.push("Flight Departure");
      newMilestones.push("Flight Arrival");
    } else if (values.travelMode === "train") {
      newMilestones.push("Train Departure");
      newMilestones.push("Train Arrival");
    }
    // Add more based on travelMode

    if (values.destination === "paris") {
      newMilestones.push("Visit Eiffel Tower");
    } else if (values.destination === "tokyo") {
      newMilestones.push("Visit Tokyo Tower");
    }
    // Add more based on destination

    setMilestones(newMilestones);
  };

  return (
    <>
      <Appbar.Header elevated>
        <Appbar.BackAction
          onPress={() => {
            /* Handle navigation */
          }}
        />
        <Appbar.Content title="Create New Trip" />
      </Appbar.Header>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <Container>
          <Formik
            initialValues={{
              title: "",
              description: "",
              origin: "",
              destination: "",
              startDate: null,
              endDate: null,
              travelMode: "",
              budgetAmount: "",
              budgetCurrency: "USD",
              activities: [],
              dietaryRestrictions: [],
              communicationPreferences: [],
              milestones: [],
            }}
            validationSchema={TripSchema}
            onSubmit={(values) => {
              // Handle trip creation logic
              setIsSubmitting(true);
              // Simulate API call
              setTimeout(() => {
                setIsSubmitting(false);
                setShowSuccessAnimation(true);
                // Redirect or reset form as needed
              }, 2000);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              values,
              errors,
              touched,
              isValid,
            }) => (
              <FormContainer>
                {/* Title */}
                <Section>
                  <Label>Title *</Label>
                  <TextInput
                    mode="outlined"
                    placeholder="Enter trip title"
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    value={values.title}
                    error={touched.title && !!errors.title}
                  />
                  {touched.title && errors.title && (
                    <HelperText type="error">{errors.title}</HelperText>
                  )}
                </Section>

                {/* Description */}
                <Section>
                  <Label>Description</Label>
                  <TextInput
                    mode="outlined"
                    placeholder="Describe your trip (optional)"
                    onChangeText={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                    multiline
                    numberOfLines={4}
                  />
                </Section>

                {/* Origin */}
                <Section>
                  <Label>Origin *</Label>
                  <DropDownPicker
                    open={false}
                    value={values.origin}
                    items={originOptions}
                    setOpen={() => {}}
                    setValue={(callback) =>
                      setFieldValue("origin", callback(values.origin))
                    }
                    placeholder="Select origin"
                    onSelectItem={(item) => setFieldValue("origin", item.value)}
                    zIndex={3000}
                    zIndexInverse={1000}
                  />
                  {touched.origin && errors.origin && (
                    <HelperText type="error">{errors.origin}</HelperText>
                  )}
                </Section>

                {/* Destination */}
                <Section>
                  <Label>Destination *</Label>
                  <DropDownPicker
                    open={false}
                    value={values.destination}
                    items={destinationOptions}
                    setOpen={() => {}}
                    setValue={(callback) =>
                      setFieldValue("destination", callback(values.destination))
                    }
                    placeholder="Enter destination city or country"
                    onSelectItem={(item) =>
                      setFieldValue("destination", item.value)
                    }
                    zIndex={2000}
                    zIndexInverse={2000}
                  />
                  {touched.destination && errors.destination && (
                    <HelperText type="error">{errors.destination}</HelperText>
                  )}
                </Section>

                {/* Start Date */}
                <Section>
                  <Label>Start Date *</Label>
                  <TouchableOpacity
                    onPress={() => setShowStartDatePicker(true)}
                  >
                    <TextInput
                      mode="outlined"
                      placeholder="Select start date"
                      value={
                        values.startDate
                          ? values.startDate.toLocaleDateString()
                          : ""
                      }
                      editable={false}
                      right={<TextInput.Icon name="calendar" />}
                      error={touched.startDate && !!errors.startDate}
                    />
                  </TouchableOpacity>
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={values.startDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowStartDatePicker(false);
                        if (selectedDate) {
                          setFieldValue("startDate", selectedDate);
                          if (values.endDate && selectedDate > values.endDate) {
                            setFieldValue("endDate", null);
                          }
                          generateMilestones({
                            ...values,
                            startDate: selectedDate,
                          });
                        }
                      }}
                    />
                  )}
                  {touched.startDate && errors.startDate && (
                    <HelperText type="error">{errors.startDate}</HelperText>
                  )}
                </Section>

                {/* End Date */}
                <Section>
                  <Label>End Date *</Label>
                  <TouchableOpacity onPress={() => setShowEndDatePicker(true)}>
                    <TextInput
                      mode="outlined"
                      placeholder="Select end date"
                      value={
                        values.endDate
                          ? values.endDate.toLocaleDateString()
                          : ""
                      }
                      editable={false}
                      right={<TextInput.Icon name="calendar" />}
                      error={touched.endDate && !!errors.endDate}
                    />
                  </TouchableOpacity>
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={values.endDate || new Date()}
                      mode="date"
                      display="default"
                      minimumDate={values.startDate || new Date()}
                      onChange={(event, selectedDate) => {
                        setShowEndDatePicker(false);
                        if (selectedDate) {
                          setFieldValue("endDate", selectedDate);
                          generateMilestones({
                            ...values,
                            endDate: selectedDate,
                          });
                        }
                      }}
                    />
                  )}
                  {touched.endDate && errors.endDate && (
                    <HelperText type="error">{errors.endDate}</HelperText>
                  )}
                </Section>

                {/* Travel Mode */}
                <Section>
                  <Label>Travel Mode *</Label>
                  <TravelModeToggle
                    selectedMode={values.travelMode}
                    onSelectMode={(mode) => {
                      setFieldValue("travelMode", mode);
                      generateMilestones({ ...values, travelMode: mode });
                    }}
                  />
                  {touched.travelMode && errors.travelMode && (
                    <HelperText type="error">{errors.travelMode}</HelperText>
                  )}
                </Section>

                {/* Budget */}
                <Section>
                  <Label>Budget *</Label>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      mode="outlined"
                      placeholder="Enter your budget amount"
                      style={{ flex: 2, marginRight: 8 }}
                      keyboardType="numeric"
                      onChangeText={handleChange("budgetAmount")}
                      onBlur={handleBlur("budgetAmount")}
                      value={values.budgetAmount}
                      error={touched.budgetAmount && !!errors.budgetAmount}
                    />
                    <DropDownPicker
                      open={false}
                      value={values.budgetCurrency}
                      items={currencyOptions}
                      setOpen={() => {}}
                      setValue={(callback) =>
                        setFieldValue(
                          "budgetCurrency",
                          callback(values.budgetCurrency)
                        )
                      }
                      style={{ flex: 1 }}
                      containerStyle={{ height: 50 }}
                      onSelectItem={(item) =>
                        setFieldValue("budgetCurrency", item.value)
                      }
                    />
                  </View>
                  {touched.budgetAmount && errors.budgetAmount && (
                    <HelperText type="error">{errors.budgetAmount}</HelperText>
                  )}
                  {touched.budgetCurrency && errors.budgetCurrency && (
                    <HelperText type="error">
                      {errors.budgetCurrency}
                    </HelperText>
                  )}
                  {/* Budget Visualization */}
                  <BudgetChart budget={parseFloat(values.budgetAmount) || 0} />
                </Section>

                {/* Preferences */}
                <Section>
                  <Label>Activities *</Label>
                  <DropDownPicker
                    multiple={true}
                    min={0}
                    max={10}
                    placeholder="Select activities"
                    open={false}
                    value={values.activities}
                    items={activitiesOptions}
                    setOpen={() => {}}
                    setValue={(callback) =>
                      setFieldValue("activities", callback(values.activities))
                    }
                    onSelectItem={(items) =>
                      setFieldValue(
                        "activities",
                        items.map((item) => item.value)
                      )
                    }
                    zIndex={1000}
                    zIndexInverse={3000}
                  />
                  {touched.activities && errors.activities && (
                    <HelperText type="error">{errors.activities}</HelperText>
                  )}
                </Section>

                <Section>
                  <Label>Dietary Restrictions</Label>
                  <DropDownPicker
                    multiple={true}
                    min={0}
                    max={10}
                    placeholder="Select dietary restrictions"
                    open={false}
                    value={values.dietaryRestrictions}
                    items={dietaryOptions}
                    setOpen={() => {}}
                    setValue={(callback) =>
                      setFieldValue(
                        "dietaryRestrictions",
                        callback(values.dietaryRestrictions)
                      )
                    }
                    onSelectItem={(items) =>
                      setFieldValue(
                        "dietaryRestrictions",
                        items.map((item) => item.value)
                      )
                    }
                    zIndex={900}
                    zIndexInverse={4000}
                  />
                </Section>

                <Section>
                  <Label>Communication Preferences</Label>
                  <DropDownPicker
                    multiple={true}
                    min={0}
                    max={10}
                    placeholder="Select communication preferences"
                    open={false}
                    value={values.communicationPreferences}
                    items={communicationOptions}
                    setOpen={() => {}}
                    setValue={(callback) =>
                      setFieldValue(
                        "communicationPreferences",
                        callback(values.communicationPreferences)
                      )
                    }
                    onSelectItem={(items) =>
                      setFieldValue(
                        "communicationPreferences",
                        items.map((item) => item.value)
                      )
                    }
                    zIndex={800}
                    zIndexInverse={5000}
                  />
                </Section>

                {/* Milestone Generator */}
                <Section>
                  <Label>Milestones</Label>
                  <MilestoneChips
                    milestones={milestones}
                    onAdd={(milestone) =>
                      setMilestones([...milestones, milestone])
                    }
                    onDelete={(milestone) =>
                      setMilestones(milestones.filter((m) => m !== milestone))
                    }
                  />
                </Section>

                {/* CTA Button */}
                <CreateTripButton
                  mode="contained"
                  onPress={handleSubmit as any}
                  disabled={!isValid || isSubmitting}
                  loading={isSubmitting}
                  contentStyle={{ paddingVertical: 8 }}
                >
                  Create Trip
                </CreateTripButton>
              </FormContainer>
            )}
          </Formik>
        </Container>
      </KeyboardAvoidingView>

      {/* Success Animation */}
      {showSuccessAnimation && (
        <View style={styles.animationContainer}>
          <LottieView
            source={require("../assets/animations/success.json")}
            autoPlay
            loop={false}
            onAnimationFinish={() => setShowSuccessAnimation(false)}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TripCreationScreen;
