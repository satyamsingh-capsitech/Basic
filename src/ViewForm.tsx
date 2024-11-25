import React from "react";
import {
  Stack,
  Text,
  Label,
  Separator,
  Panel,
  PanelType,
  Image,
  DefaultButton,
} from "@fluentui/react";
import { toWords } from "number-to-words";
interface ViewFormProps {
  isOpen: boolean;
  onDismiss: () => void;
  item: items;
}
interface items {
  name: string;
  emailId: string;
  phoneNo: string;
  building: string;
  street: string;
  landmark: string;
  city: string;
  district: string;
  pincode: string;
  state: string;
  country: string;
  // items: ItemReqModel[];

  discount: string;
  amountPaid: string;
  description: string;
  appliedQty:string;
  price:string;
  gst:string
  date: string;
  billNo: string;
  billId: string;
  amount: string;
  finalAmount:string;
  subTotal:string;
  balance:string
}

const ViewForm: React.FC<ViewFormProps> = ({ isOpen, onDismiss, item }) => {
  if (!item) {
    return <div>No data is passed</div>;
  }
  console.log("items", item);
  const renderAddress = (address: items) => {
    if (!address) return "N/A";
    const {
      building,
      street,
      landmark,
      city,
      district,
      pincode,
      state,
      country,
    } = address;
    return (
      <>
        {building}, {street}, {landmark}, {city}, {district}, {pincode}, {state}
        , {country}
      </>
    );
  };

  const renderTestDescriptions = (items: items[]) => {
    if (!items || items.length === 0) {
      return (
        <tr>
          <td colSpan={5} style={{ textAlign: "center" }}>
            No test descriptions available.
          </td>
        </tr>
      );
    }

    return items.map((desc, index) => (
      <tr key={index} style={{ borderBottom: "1px solid #eee" }}>
        <td>{desc.description || "N/A"}</td>
        <td>{desc.appliedQty || "0"}</td>
        <td>{desc.price || "0"}</td>
        <td>{desc.gst || "0"}</td>
        <td>{desc.amount || "0"}</td>
      </tr>
    ));
  };

  const convertAmountToWords = (amount: number) => {
    return toWords(amount);
  };

  return (
    <Panel
      isOpen={isOpen}
      onDismiss={onDismiss}
      type={PanelType.custom}
      customWidth="800px"
      headerText="Health Checkup Bill View"
      closeButtonAriaLabel="Close"
    >
      <Stack horizontal tokens={{ childrenGap: 350 }}>
        <Stack
          styles={{
            root: { width: 200, backgroundColor: "#ffffff", padding: 10 },
          }}
        >
          <Image
            src="https://www.capsitech.com/wp-content/themes/capsitech/assets/images/capLogo.svg"
            alt="capsitech"
            height="Auto"
            width="Auto"
          />
        </Stack>
        <Stack
          styles={{
            root: {
              width: 80,
              backgroundColor: "#ffffff",
            },
          }}
        >
          <Image
            src="https://www.capsitech.com/wp-content/uploads/2020/10/200x200.png"
            alt="capsitech"
            height="Auto"
            width="Auto"
          />
        </Stack>
      </Stack>

      <Stack tokens={{ childrenGap: 15 }} styles={{ root: { padding: 20 } }}>
        {/* Header Section */}
        <Stack horizontal tokens={{ childrenGap: 20 }}>
          <Stack.Item grow>
            <Label>Bill From</Label>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Address:</td>
                  <td>{"Boranada"}</td>
                </tr>
                <tr>
                  <td>Phone No:</td>
                  <td>{"+12345"}</td>
                </tr>
                <tr>
                  <td>GSTIN:</td>
                  <td>{"Gst+1234"}</td>
                </tr>
              </tbody>
            </table>
          </Stack.Item>

          <Stack.Item grow>
            <Label>Customer Details</Label>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Name:</td>
                  <td>{item.name || "N/A"}</td>
                </tr>
                <tr>
                  <td>Address:</td>
                  <td>{renderAddress(item.address)}</td>
                </tr>
                <tr>
                  <td>Phone Number:</td>
                  <td>{item.phoneNo || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </Stack.Item>

          <Stack.Item grow>
            <Label>Bill Details</Label>
            <table style={{ width: "100%" }}>
              <tbody>
                <tr>
                  <td>Bill:</td>
                  <td>{item.billNo || "N/A"}</td>
                </tr>
                <tr>
                  <td>Booking ID:</td>
                  <td>{item.billId || "N/A"}</td>
                </tr>
                <tr>
                  <td>Date:</td>
                  <td>{item.date || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </Stack.Item>
        </Stack>

        <Separator />

        {/* Test Descriptions Table */}
        <Stack>
          <table style={{ width: "80%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{ fontWeight: "bold", borderBottom: "1px solid #ccc" }}
              >
                <th style={{ width: "35%" }}>Test Description</th>
                <th style={{ width: "10%" }}>Quantity</th>
                <th style={{ width: "15%" }}>Price/Unit</th>
                <th style={{ width: "10%" }}>GST (%)</th>
                <th style={{ width: "15%" }}>Amount</th>
              </tr>
            </thead>
            <tbody>{renderTestDescriptions(item.items)}</tbody>
          </table>
        </Stack>

        <Separator />

        {/* Summary Section */}
        <Label>Summary</Label>
        <Stack horizontal tokens={{ childrenGap: 20 }}>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "70%" }}>Amount in Words</td>
                <td>{convertAmountToWords(item.finalAmount) || "N/A"}</td>
              </tr>
              <tr>
                <td>Sub Total:</td>
                <td>{item.subTotal || "0"}</td>
              </tr>
              <tr>
                <td>Discount:</td>
                <td>{item.discount || "0"}</td>
              </tr>
              <tr>
                <td>Final Amount:</td>
                <td>{item.finalAmount || "0"}</td>
              </tr>
              <tr>
                <td>Amount Paid:</td>
                <td>{item.amountPaid || "0"}</td>
              </tr>
              <tr>
                <td>Balance:</td>
                <td
                  style={{
                    color: item.balance && item.balance > 0 ? "green" : "red",
                  }}
                >
                  {item.balance || "0"}
                </td>
              </tr>
            </tbody>
          </table>
        </Stack>

        <Separator />

        {/* Footer */}
        <Text styles={{ root: { width: "70%" } }}>Declaration</Text>

        <Stack horizontal tokens={{ childrenGap: 20 }}>
          <Stack.Item grow>
            <Stack
              styles={{
                root: { width: 200, backgroundColor: "#ffffff", padding: 10 },
              }}
            >
              <Image
                src="https://www.shutterstock.com/image-vector/handwritten-signature-signed-papers-documents-260nw-2248268539.jpg"
                alt="Signature"
                height="Auto"
                width="Auto"
              />
            </Stack>
          </Stack.Item>
          <Stack.Item grow>
            <Stack
              styles={{
                root: {
                  width: 200,
                  backgroundColor: "#ffffff",
                  padding: 10,
                  marginLeft: "20px",
                },
              }}
            >
              <Image
                src="https://onlinepngtools.com/images/examples-onlinepngtools/george-walker-bush-signature.png"
                alt="Signature"
                height="Auto"
                width="Auto"
              />
            </Stack>
          </Stack.Item>
        </Stack>

        <Text
          variant="mediumPlus"
          styles={{ root: { textAlign: "center", marginTop: 20 } }}
        >
          Thanks for business with us! Please visit us again!
        </Text>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton text="Cancel" onClick={onDismiss} />
        </Stack>
      </Stack>
    </Panel>
  );
};

export default ViewForm;
