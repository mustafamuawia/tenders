import React, { useState, useEffect, useMemo } from "react";
import {
    Button,
    Card,
    CardBody,
    CardGroup,
    Col,
    Container,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Label,
    FormGroup,
    CardHeader,
    Table,
    Badge,
    Pagination,
    PaginationItem,
    PaginationLink,
} from "reactstrap";
import DataTable from "react-data-table-component";
import Select from "react-select";

export default function Rfq() {
    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const [filteredItems, setfilteredItems] = useState([]);
    const [oldFilter, setOldFilter] = useState("");
    const [selectedRows, setSelectedRows] = React.useState([]);
    const [toggleCleared, setToggleCleared] = React.useState(false);
    const options = [
        { value: "option1", label: "Option 1" },
        { value: "option2", label: "Option 2" },
    ];

    let initFormData = {
        Project: "",
        Client: "",
        IssueDate: "",
        ExpireDate: "",
        Partner: "",
        Summary: "",
        quantity: 0,
        price: 0,
    };

    const [formData, setformData] = useState(initFormData);
    const input = {
        height: "32px",
        width: "200px",
        borderRadius: "3px",
        borderTopLeftRadius: "5px",
        borderBottomReftRadius: "5px",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        border: "1px solid #e5e5e5",
        padding: "0 32px 0 16px",

        "&:hover": {
            cursor: "pointer",
        },
    };
    const customStyles = {
        // rows: {
        //     style: {
        //         minHeight: '72px', // override the row height
        //     },
        // },
        headCells: {
            ".eUeqdG": { whiteSpace: "break-spaces !important" },

            style: {
                whiteSpace: "break-spaces !important",
                // paddingLeft: '8px', // override the cell padding for head cells
                // paddingRight: '8px',
            },
        },
        // cells: {
        //     style: {
        //         paddingLeft: '8px', // override the cell padding for data cells
        //         paddingRight: '8px',
        //     },
        // },
    };
    const ClearButton = {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        borderTopRightRadius: "5px",
        borderBottomBightRadius: "5px",
        height: "34px",
        width: "32px",
        textAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    };

    const FilterComponent = ({ filterText, onFilter, onClear }) => (
        <>
            <Input
                id="search"
                type="text"
                placeholder="Filter end user company"
                aria-label="Search Input"
                value={filterText}
                onChange={onFilter}
                autoFocus
                style={input}
            />
            <button style={ClearButton} type="button" onClick={onClear}>
                X
            </button>
        </>
    );
    const handleDeleteButtonClick = (e) => {
        console.log(e.target.name);
    };

    const handleEditButtonClick = (e) => {
        console.log(e.target.name);
    };

    const subHeaderComponentMemo = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return (
            <FilterComponent
                onFilter={(e) => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText, resetPaginationToggle]);
    const [Tenders, setTenders] = useState([]);
    const [value, setValue] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    function getUser() {
        var user = localStorage.getItem("user");
        return JSON.parse(user);
    }
    const columns = [
        {
            selector: (row) => row.TenderId,
            cell: (row) => (
                <>
                    <button
                        name={row.TenderId}
                        className="btn btn-danger"
                        style={{ display: "block !important", width: "100%" }}
                        onClick={() => deleteRow(row.TenderId)}
                    >
                        Delete
                    </button>
                    {!isAdmin ? (
                        <button
                            name={row.TenderId}
                            style={{
                                display: "block !important",
                                width: "100%",
                            }}
                            className="btn btn-info"
                            onClick={() => editRow(row)}
                        >
                            Edit
                        </button>
                    ) : (
                        <></>
                    )}
                </>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            name: "Project",
            selector: (row) => row.Project,
            wrap: true,
            sortable: true,
        },
        {
            name: "Client Name",
            selector: (row) => row.ClientName,
            wrap: true,
            sortable: true,
        },
        {
            name: "IssueDate",
            selector: (row) => row.IssueDate,
            wrap: true,
            sortable: true,
        },
        {
            name: "ExpireDate",
            selector: (row) => row.ExpireDate,
            wrap: true,
            sortable: true,
        },
        {
            name: "Partner",
            selector: (row) => row.Partner,
            wrap: true,
            sortable: true,
        },
        {
            name: "Project Status",
            selector: (row) => row.Status,
            wrap: true,
            sortable: true,
        },
        {
            name: "Summary",
            selector: (row) => row.Summary,
            wrap: true,
            sortable: true,
        },
    ];

    function handleChange(event) {
        const value = event.target.value;
        setformData((formData) => ({
            ...formData,
            [event.target.name]: event.target.value,
        }));
    }

    const getData = async () => {
        const token = localStorage.getItem("access_token");

        await fetch(process.env["REACT_APP_API_URL"] + "/tender/gettenders", {
            // mode:'cors',
            headers: {
                "Access-Control-Allow-Origin": "*",
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + token + "",
            },
        })
            .then((res) => res.json())
            .then(
                (result) => {
                    setTenders(result);
                    setfilteredItems(result);
                },

                (error) => {}
            );
    };

    const editRow = (row) => {
        setformData(row);
    };

    const deleteRow = (id) => {
        if (window.confirm("Are you sure to delete this record?")) {
            const token = localStorage.getItem("access_token");
            fetch(
                process.env["REACT_APP_API_URL"] + "/auth/tender/delete/" + id,
                {
                    method: "get",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token + "",
                    },
                }
            )
                .then(getData())
                .then(setformData(initFormData))
                .then(alert("تم"));
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem("access_token");

        if (
            formData.TenderId != "" &&
            typeof formData.TenderId != "undefined"
        ) {
            fetch(process.env["REACT_APP_API_URL"] + "/auth/tender/update", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token + "",
                },
                body: JSON.stringify(formData),
            })
                .then(getData())
                .then(setformData(initFormData))
                .then(alert("تم"));
        } else {
            fetch(process.env["REACT_APP_API_URL"] + "/auth/tender/create", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token + "",
                },
                body: JSON.stringify(formData),
            })
                .then(getData())
                .then(setformData(formData))
                .then(alert("تم"));
        }
    };
    useEffect(() => {
        getData();

        const user = getUser();
        if (user.role == "Admin") {
            setIsAdmin(true);
        } else setIsAdmin(false);
    }, [value]);
    useEffect(() => {
        setfilteredItems(
            Tenders.filter(
                (item) =>
                    item.ProjectTitle &&
                    item.ProjectTitle.toLowerCase().includes(
                        filterText.toLowerCase()
                    )
            )
        );
    }, [filterText]);
    return (
        <Container>
            <Row>
                <Col lg="12" xs="12">
                    <Card>
                        <CardHeader>
                            <h1>Add RFQ</h1>
                        </CardHeader>
                        <CardBody>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col lg="4">
                                        <div className="form-group">
                                            <Label htmlFor="Client">
                                                Client
                                            </Label>
                                            <Select
                                                options={options}
                                                onChange={handleChange}
                                                name="client"
                                                value={formData.Status}
                                                placeholder="Search"
                                                isSearchable={true}
                                                isDisabled={isAdmin}
                                            />
                                        </div>
                                    </Col>
                                    <Col lg="4">
                                        <div className="form-group">
                                            <Label htmlFor="Project">
                                                Project
                                            </Label>
                                            <Select
                                                options={options}
                                                onChange={handleChange}
                                                name="project"
                                                value={formData.Status}
                                                placeholder="Search"
                                                isSearchable={true}
                                                isDisabled={isAdmin}
                                            />
                                        </div>
                                    </Col>
                                    <Col lg="4">
                                        <div className="form-group">
                                            <Label htmlFor="IssueDate">
                                                {" "}
                                                Issue Date{" "}
                                            </Label>
                                            <Input
                                                type="date"
                                                onChange={handleChange}
                                                value={formData.IssueDate}
                                                name="issue_date"
                                                disabled={isAdmin} // Disable if not admin
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="12">
                                        <div className="col-12">
                                            <div
                                                className="form-group"
                                                app-field-wrapper="notes"
                                            >
                                                <label
                                                    htmlFor="notes"
                                                    className="control-label"
                                                >
                                                    Note
                                                </label>
                                                <textarea
                                                    id="notes"
                                                    name="notes"
                                                    className="form-control"
                                                    rows="4"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col lg="12">
                                        <div className="form-group mt-4">
                                            <Label htmlFor="itemSearch">
                                                Select Item
                                            </Label>
                                            <Select
                                                options={options}
                                                onChange={handleChange}
                                                name="itemSearch"
                                                value={formData.itemSearch}
                                                placeholder="Search"
                                                isSearchable={true}
                                                isDisabled={isAdmin}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                            {/* Table */}
                            <div
                                className="mt-4"
                                style={{
                                    borderBottom: "1px solid #ced4da",
                                    marginBottom: "20px",
                                }}
                            >
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Item</th>
                                            <th>Qty</th>
                                            <th>Admin Qty</th>
                                            <th>Price</th>
                                            <th>Unit</th>
                                            <th>RFQ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <Input type="text" />
                                            </td>
                                            <td>
                                                <Input type="number" />
                                            </td>
                                            <td>
                                                <Input type="number" />
                                            </td>
                                            <td>
                                                <Input type="text" />
                                            </td>
                                            <td>
                                                <Select
                                                    options={options}
                                                    onChange={handleChange}
                                                    name="unit"
                                                    value={formData.Status}
                                                    isSearchable={true}
                                                    isDisabled={isAdmin}
                                                />
                                            </td>
                                            <td>
                                                <Input type="text" />
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
                <div className="fixed-bottom d-flex justify-content-center mb-3">
                    <Button color="primary">Save</Button>
                </div>
            </Row>
        </Container>
    );
}
