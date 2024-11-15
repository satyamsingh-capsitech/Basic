import React from "react";
import {
  Panel,
  PanelType,
  TextField,
  PrimaryButton,
  DefaultButton,
  Stack,
  Label,
} from "@fluentui/react";
import { MdDelete } from "react-icons/md";
import { Formik, Form, FieldArray, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

interface HealthRequestFormPanelProps {
  isOpen: boolean;
  onDismiss: () => void;
  id?: string;
  initialData?: any;
}

interface ItemReqModel {
  description: string;
  appliedQty: string;
  price: string;
  gst: string;
  amount: string;
}

const initialValues = {
  name: "",
  emailId: "",
  phoneNo: "",
  building: "",
  street: "",
  landmark: "",
  city: "",
  district: "",
  pincode: "",
  state: "",
  country: "India",
  items: [
    {
      description: "",
      appliedQty: "1",
      price: "",
      gst: "",
      amount: "",
    },
  ] as ItemReqModel[],
  discount: "",
  amountPaid: "",
  declaration: "",
  date: new Date().toISOString(),
};

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  emailId: Yup.string().email("Invalid email").required("Email is required"),
  phoneNo: Yup.string().required("Phone number is required"),
  building: Yup.string().required("Building is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  items: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().required("Description is required"),
      appliedQty: Yup.string().required("Quantity is required"),
      price: Yup.string().required("Price is required"),
      gst: Yup.number().required("GST is required").positive(),
    })
  ),
  amountPaid: Yup.number().required("Amount paid is required").positive(),
});

const HealthRequestFormPanel: React.FC<HealthRequestFormPanelProps> = ({
  isOpen,
  onDismiss,
}) => {
  const handleSubmit = async (values) => {
    // Calculate amounts for each item
    values.items.forEach((item) => {
      const price = parseFloat(item.price) || 0;
      const qty = parseFloat(item.appliedQty);
      const gst = parseFloat(item.gst) || 0;
      const amount = price * qty * (1 + gst / 100);
      // item.amount = amount.toFixed(2);
      item.amount = Math.round(amount); // This rounds it to an integer
    });

    const subTotal = values.items.reduce(
      (total, item) => total + parseFloat(item.amount),
      0
    );

    const discount = parseFloat(values.discount) || 0;
    const finalAmount = subTotal - discount;

    const amountPaid = parseFloat(values.amountPaid) || 0;
    const balance = finalAmount - amountPaid;

    const requestData = {
      name: values.name,
      autoNumber: 0,
      billNo: "12345", // Static
      billId: "12345", // Static
      description: values.declaration,
      emailId: values.emailId,
      phoneNo: values.phoneNo,
      address: {
        building: values.building,
        street: values.street,
        landmark: values.landmark,
        city: values.city,
        district: values.district,
        pincode: values.pincode,
        state: values.state,
        country: values.country,
      },
      items: values.items.map((item) => ({
        description: item.description,
        appliedQty: parseInt(item.appliedQty, 10),
        price: item.price,
        gst: parseFloat(item.gst),
        amount: parseFloat(item.amount),
      })),
      subTotal,
      discount,
      finalAmount,
      amountPaid,
      balance,
      declaration: values.declaration,
      isDeleted: true,
      date: new Date(values.date).toISOString(),
    };

    console.log("Request Data: ", requestData);

    try {
      const response = await axios.post(
        "https://localhost:7147/api/Health",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Form submitted successfully!");
        onDismiss();
      } else {
        console.error("Response status: ", response.status);
        alert("There was an issue submitting the form.");
      }
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Error submitting form. Please try again later.");
    }
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.custom}
      customWidth="600px"
      headerText="Add Request"
      closeButtonAriaLabel="Close"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isValid }) => (
          <Form>
            <Stack tokens={{ childrenGap: 15 }}>
              {/* Personal Details */}
              <Label>Personal Details</Label>
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <TextField
                  label="Name"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.name && errors.name ? errors.name : ""}
                />
                <TextField
                  label="Email ID"
                  name="emailId"
                  type="email"
                  value={values.emailId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={
                    touched.emailId && errors.emailId ? errors.emailId : ""
                  }
                />
                <TextField
                  label="Phone No"
                  name="phoneNo"
                  type="tel"
                  value={values.phoneNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={
                    touched.phoneNo && errors.phoneNo ? errors.phoneNo : ""
                  }
                />
              </Stack>

              {/* Address Fields */}
              <Label>Address</Label>
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <TextField
                  label="Building"
                  name="building"
                  value={values.building}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={
                    touched.building && errors.building ? errors.building : ""
                  }
                />
                <TextField
                  label="Street"
                  name="street"
                  value={values.street}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  label="Landmark"
                  name="landmark"
                  value={values.landmark}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <TextField
                  label="City"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={touched.city && errors.city ? errors.city : ""}
                />
                <TextField
                  label="District"
                  name="district"
                  value={values.district}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  label="Pincode"
                  name="pincode"
                  value={values.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Stack>
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <TextField
                  label="State"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={
                    touched.state && errors.state ? errors.state : ""
                  }
                />
                <TextField
                  label="Country"
                  name="country"
                  value={values.country}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Stack>

              {/* Item Details */}
              <Label>Item Details</Label>
              <FieldArray name="items">
                {({ remove, push }) => (
                  <>
                    {values.items.map((item, index) => (
                      <Stack key={index} tokens={{ childrenGap: 10 }}>
                        <Stack horizontal tokens={{ childrenGap: 10 }}>
                          <TextField
                            label="Description"
                            name={`items[${index}].description`}
                            value={item.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            errorMessage={
                              touched.items?.[index]?.description &&
                              errors.items?.[index]?.description
                                ? errors.items[index].description
                                : ""
                            }
                          />
                          <TextField
                            label="Quantity"
                            name={`items[${index}].appliedQty`}
                            value={item.appliedQty}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <TextField
                            label="Price"
                            name={`items[${index}].price`}
                            value={item.price}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </Stack>
                        <Stack horizontal tokens={{ childrenGap: 10 }}>
                          <TextField
                            label="GST %"
                            name={`items[${index}].gst`}
                            value={item.gst}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <TextField
                            label="Amount"
                            name={`items[${index}].amount`}
                            value={item.amount}
                            disabled
                          />
                          <MdDelete
                            title="Remove Item"
                            onClick={() => remove(index)}
                          />
                        </Stack>
                      </Stack>
                    ))}
                    <PrimaryButton
                      text="Add"
                      style={{ width: "20px" }}
                      onClick={() =>
                        push({
                          description: "",
                          appliedQty: "1",
                          price: "",
                          gst: "",
                          amount: "",
                        })
                      }
                    />
                  </>
                )}
              </FieldArray>

              {/* Payment Details */}
              <Label>Payment Details</Label>
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <TextField
                  label="Discount"
                  name="discount"
                  value={values.discount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <TextField
                  label="Amount Paid"
                  name="amountPaid"
                  value={values.amountPaid}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  errorMessage={
                    touched.amountPaid && errors.amountPaid
                      ? errors.amountPaid
                      : ""
                  }
                />
              </Stack>

              <TextField
                label="Declaration"
                name="declaration"
                multiline
                rows={3}
                value={values.declaration}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Stack horizontal tokens={{ childrenGap: 10 }}>
                <PrimaryButton
                  type="submit"
                  text="Submit"
                  disabled={!isValid}
                />
                <DefaultButton text="Cancel" onClick={onDismiss} />
              </Stack>
            </Stack>
          </Form>
        )}
      </Formik>
    </Panel>
  );
};

export default HealthRequestFormPanel;
