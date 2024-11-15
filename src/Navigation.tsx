import React, { useEffect, useState } from "react";
import {
  Stack,
  Text,
  PrimaryButton,
  Persona,
  PersonaSize,
  DetailsList,
  DetailsListLayoutMode,
  IColumn,
  Image,
  SearchBox,
  IconButton,
  Panel,
  PanelType,
} from "@fluentui/react";
import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaChartBar,
  FaFileAlt,
  FaHome,
  FaUsers,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import Form from "./Form";
import ViewForm from "./ViewForm";
const Navigation = () => {
  const sidebarItems = [
    { label: "Dashboard", icon: <FaHome /> },
    { label: "Leaves", icon: <FaCalendarAlt /> },
    { label: "Attendance Request", icon: <FaUsers /> },
    { label: "Reports", icon: <FaChartBar /> },
    { label: "Events", icon: <FaCalendarCheck /> },
    { label: "Company policies", icon: <FaFileAlt /> },
  ];
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [viewItem, setViewItem] = useState<any>(null);

  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => {
    setIsPanelOpen(false);
    setFormData(null);
  };

  const openViewPanel = (item: any) => {
    setViewItem(item);
    console.log("Item details for View:", item);
    setIsViewPanelOpen(true);
  };

  const closeViewPanel = () => {
    setIsViewPanelOpen(false);
    setViewItem(null);
  };

  const onDelete = async (id: string) => {
    try {
      const itemToDelete = items.find((item) => item.id === id);

      if (itemToDelete) {
        const updatedItem = { ...itemToDelete, isDeleted: false };

        const response = await axios.post(
          `https://localhost:7147/api/Health`,
          updatedItem
        );

        if (response.status === 200) {
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, isDeleted: true } : item
            )
          );
          console.log("Item deleted successfully");
        }
      } else {
        console.log("Item not found");
      }
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const onEdit = async (id: string) => {
    const selectedItem = items.find((item) => item.id === id);
    if (selectedItem) {
      setFormData(selectedItem);
      setIsPanelOpen(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7147/api/Health");
        setItems(response.data);
        setViewItem(response.data);
        console.log("UR DATA", setViewItem);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const columns: IColumn[] = [
    {
      key: "sno",
      name: "S No",
      fieldName: "sno",
      minWidth: 50,
      maxWidth: 70,
      isResizable: true,
      onRender: (item, index) => <Text>{index + 1}</Text>,
    },
    {
      key: "billId",
      name: "BillId",
      fieldName: "billId",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "phoneNo",
      name: "Phone No",
      fieldName: "phoneNo",
      minWidth: 100,
      maxWidth: 200,
      isResizable: true,
    },
    {
      key: "email",
      name: "Email",
      fieldName: "emailId",
      minWidth: 100,
      maxWidth: 300,
      isResizable: true,
    },
    {
      key: "actions",
      name: "Actions",
      fieldName: "actions",
      minWidth: 150,
      maxWidth: 200,
      isResizable: true,
      onRender: (item) => (
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <FaEye
            onClick={() => openViewPanel(item)}
            style={{ cursor: "pointer" }}
          />
          <FaEdit
            onClick={() => onEdit(item.id)}
            style={{ cursor: "pointer" }}
          />
          <MdDelete
            onClick={() => onDelete(item.id)}
            style={{ cursor: "pointer", color: "red" }}
          />
        </Stack>
      ),
    },
  ];

  return (
    <Stack horizontal>
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
        {sidebarItems.map((item) => (
          <Stack
            key={item.label}
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 10 }}
            styles={{
              root: { margin: "10px 0", color: "#2e7dd8", cursor: "pointer" },
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <Text variant="medium">{item.label}</Text>
          </Stack>
        ))}
      </Stack>
      <Stack grow styles={{ root: { backgroundColor: "#ffffff" } }}>
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          styles={{
            root: {
              padding: 8,
              borderBottom: "5px solid #f3f3f3",
              backgroundColor: "#0079ed",
            },
          }}
        >
          <Stack grow />
          <Persona text="credentials" size={PersonaSize.size32} />
        </Stack>
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          styles={{ root: { padding: 10 } }}
        >
          <PrimaryButton text="+ Add" onClick={() => openPanel()} />
          <SearchBox placeholder="Search" />
        </Stack>
        <DetailsList
          items={items}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          //selectionPreservedOnEmptyClick
        />
        {/* Form Panel */}
        <Panel
          isOpen={isPanelOpen}
          onDismiss={closePanel}
          type={PanelType.custom}
          customWidth="500px"
          headerText={formData ? "Edit form" : "Add Form"}
        >
          <Form isOpen={isPanelOpen} onDismiss={closePanel} />
        </Panel>
        {/* View Form Panel */}
        <Panel
          isOpen={isViewPanelOpen}
          onDismiss={closeViewPanel}
          type={PanelType.custom}
          customWidth="500px"
          headerText={"View Details"}
        >
          <ViewForm
            isOpen={isViewPanelOpen}
            onDismiss={closeViewPanel}
            item={viewItem}
          />
        </Panel>
      </Stack>
    </Stack>
  );
};
export default Navigation;
