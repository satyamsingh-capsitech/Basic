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
  Panel,
  PanelType,
  SelectionMode,
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
  FaUndo,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from "axios";
import Form from "./Form";
import ViewForm from "./ViewForm";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const sidebarItems = [
    { label: "Dashboard", icon: <FaHome /> },
    { label: "Leaves", icon: <FaCalendarAlt /> },
    { label: "Attendance Request", icon: <FaUsers /> },
    { label: "Reports", icon: <FaChartBar /> },
    { label: "Events", icon: <FaCalendarCheck /> },
    { label: "Company policies", icon: <FaFileAlt /> },
  ];
  const navigate = useNavigate();

  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isViewPanelOpen, setIsViewPanelOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [viewItem, setViewItem] = useState<any>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [billSearchQuery, setBillSearchQuery] = useState<string>("");

  const openPanel = () => setIsPanelOpen(true);
  const closePanel = () => {
    setIsPanelOpen(false);
    setFormData(null);
  };

  const openViewPanel = (item: any) => {
    setViewItem(item);
    setIsViewPanelOpen(true);
  };

  const closeViewPanel = () => {
    setIsViewPanelOpen(false);
    setViewItem(null);
  };
  const token = localStorage.getItem("token");
  const onDelete = async (id: string) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete the data?"
      );
      if (confirm) {
        const itemToDelete = items.find((item) => item.id === id);
        if (itemToDelete) {
          const updatedItem = { ...itemToDelete, isDeleted: false };
          const response = await axios.put(
            `https://localhost:7147/api/Health?id=${id}`,
            updatedItem,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            setItems((prevItems) =>
              prevItems.map((item) =>
                item.id === id ? { ...item, isDeleted: false } : item
              )
            );
            console.log("Item deleted successfully");
          }
        }
      }
    } catch (error) {
      console.error("Error deleting item", error);
    }
  };

  const onRevert = async (id: string) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to revert the data back?"
      );
      if (confirm) {
        const itemToDelete = items.find((item) => item.id === id);
        if (itemToDelete) {
          const updatedItem = { ...itemToDelete, isDeleted: true };
          const response = await axios.put(
            `https://localhost:7147/api/Health?id=${id}`,
            updatedItem,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            setItems((prevItems) =>
              prevItems.map((item) =>
                item.id === id ? { ...item, isDeleted: true } : item
              )
            );
            console.log("Item reverted successfully");
          }
        }
      }
    } catch (error) {
      console.error("Error reverting item", error);
    }
  };

  const onEdit = async (id: string) => {
    setEditId(id);
    setIsPanelOpen(true);
  };

  const fetchData = async (name: string = "", billId: string = "") => {
    try {
      const response = await axios.get("https://localhost:7147/api/Health", {
        params: {
          name: name,
          billId: billId,
          //sent to backend
        },
        headers: {
          Authorization: `Bearer ${token}`, // token
        },
      });
      setItems(response.data); // Update items
    } catch (error) {
      console.error("Error fetching data", error);
      console.log("here i m", error);
    }
  };

  const onSearchChange = (newSearchQuery: string, newBillidquery: string) => {
    setSearchQuery(newSearchQuery);
    // setBillSearchQuery(newBillidquery);
    fetchData(newSearchQuery, newBillidquery); //  data search
  };

  useEffect(() => {
    fetchData(); // initially all data
  }, []);

  const handleLogout = () => {
    const confirm = window.confirm("sure want to logout");
    if (confirm) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } else {
      console.log("cancelled");
    }
  };

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
          {!item.isDeleted ? (
            <FaUndo
              onClick={() => onRevert(item.id)}
              style={{ cursor: "pointer", color: "green" }}
            />
          ) : (
            <>
              <FaEdit
                onClick={() => onEdit(item.id)}
                style={{ cursor: "pointer" }}
              />

              <MdDelete
                onClick={() => onDelete(item.id)}
                style={{ cursor: "pointer", color: "red" }}
              />
            </>
          )}
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
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: 10 }}
            styles={{
              root: {
                margin: "10px 0",
                color: "red",
                cursor: "pointer",
                padding: "10px",
              },
            }}
          >
            <FaSignOutAlt size={20} />
            <PrimaryButton text="Logout" onClick={handleLogout} />
          </Stack>
        </Stack>
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          styles={{ root: { padding: 10 } }}
        >
          <PrimaryButton text="+ Add" onClick={() => openPanel()} />
          <SearchBox
            placeholder="Search"
            onChange={(_, newValue) => onSearchChange(newValue || "")}
          />
        </Stack>
        <DetailsList
          items={items}
          columns={columns}
          setKey="set"
          layoutMode={DetailsListLayoutMode.fixedColumns}
          selectionMode={SelectionMode.none}
        />
        {/* Form Panel */}
        <Panel
          isOpen={isPanelOpen}
          onDismiss={closePanel}
          type={PanelType.custom}
          customWidth="500px"
          headerText={formData ? "Edit form" : "Add Form"}
        >
          <Form isOpen={isPanelOpen} onDismiss={closePanel} id={editId} />
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
