import React, { useState,useEffect,useMemo } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, 
  InputGroup, InputGroupAddon, InputGroupText, Row,Label,FormGroup,CardHeader,Table,
  Badge,Pagination,PaginationItem,PaginationLink} from 'reactstrap';
  import DataTable from 'react-data-table-component';

export default function Tenders() {
  const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredItems,setfilteredItems]=useState([]) ;
  const [oldFilter,setOldFilter]=useState('')
  const [selectedRows, setSelectedRows] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);
	
  let initFormData= { 
    TenderId:'',
      UserId:0,
      EndUserCompanyName:'',
      EndUserContactName:'',
      EndUserContactEmail:'',
      EndUserContactPhone:'',
      InstallationCity:'',
      InstallationState:'',
      ResellerCompanyName:'',
      ResellerContactName:'',
      ResellerEmail:'',
      DistributorCompanyName:'',
      DistributorContactName:'',
      DistributorEmail:'',
      TenderCode:'',
      Sector:'Private',
      Summary:'',
      Revenue:'',
      PurchasingDecisionDate:'',
      StartDate:'',
      FinishDate:'',
    Status: 'Initial'}

  const [formData,setformData]= useState(initFormData)
  const input = { 
  	height: '32px',
  	width: '200px',
  	borderRadius: '3px',
  	borderTopLeftRadius: '5px',
  	borderBottomReftRadius: '5px',
  	borderTopRightRadius: 0,
  	borderBottomRightRadius: 0,
  border: '1px solid #e5e5e5',
  	padding: '0 32px 0 16px',
  
  	"&:hover": {
  		cursor: 'pointer',
  	}
  }
  const customStyles = {
    // rows: {
    //     style: {
    //         minHeight: '72px', // override the row height
    //     },
    // },
    headCells: {
      '.eUeqdG':{whiteSpace:'break-spaces !important',},

        style: {
          whiteSpace: 'break-spaces !important',
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
  	borderTopRightRadius: '5px',
  	borderBottomBightRadius: '5px',
  	height: '34px',
  	width: '32px',
  	textAlign: 'center',
  	display: 'flex',
  	alignItems: 'center',
  	justifyContent: 'center',
  }
 

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
				setFilterText('');
			}
		};

		return (
			<FilterComponent onFilter={e => 
        setFilterText(e.target.value)} 
        onClear={handleClear} 
        filterText={filterText} />
		);
	}, [filterText, resetPaginationToggle]);
    const [Tenders, setTenders] = useState([]);
    const [value,setValue] = useState('')
    const [isAdmin,setIsAdmin] = useState(false)

    function getUser()  
    {
      var user = localStorage.getItem('user')
      return JSON.parse(user);
    }
    const columns = [
      {
				selector: row => row.TenderId,
				cell: (row) => <>
        <button name={row.TenderId} className='btn btn-danger' style={{display: 'block !important',
            width:'100%'}} onClick={(()=>deleteRow(row.TenderId))}>Delete</button>
         {!isAdmin?<button name={row.TenderId} style={{display: 'block !important',
            width:'100%'}} className='btn btn-info' onClick={(()=>editRow(row))}>Edit</button>:<></>}
        </>,
				ignoreRowClick: true,
				allowOverflow: true,
				button: true,
			},
      { name: 'ProjectId', selector: row => row.TenderId,wrap	:true,sortable:true	},
      { name: 'Partner', selector: row => row.user.partner.CompanyName,wrap	:true,sortable:true	},
      { name: 'End User Company Name', selector: row => row.EndUserCompanyName,wrap	:true,sortable:true	},
      { name: 'EndUser Contact Name', selector: row => row.EndUserContactName,wrap	:true,sortable:true	},
      { name: 'End User Contact Email', selector: row => row.EndUserContactEmail,wrap	:true,sortable:true	},
      { name: 'End User Contact Phone', selector: row => row.EndUserContactPhone,wrap	:true,sortable:true	},
      { name: 'Installation City', selector: row => row.InstallationCity,wrap	:true,sortable:true	},
      { name: 'Project Status', selector: row => row.Status,wrap	:true,sortable:true	},
      // { name: 'Installation State', selector: row => row.InstallationState,wrap	:true,sortable:true	},
      // // { name: 'Reseller Company Name', selector: row => row.ResellerCompanyName,wrap	:true,sortable:true	},
      // { name: 'Reseller Contact Name', selector: row => row.ResellerContactName,wrap	:true,sortable:true	},
      // { name: 'Reseller Email', selector: row => row.ResellerEmail,wrap	:true,sortable:true	},
      // { name: 'Distributor Company Name', selector: row => row.DistributorCompanyName,wrap	:true,sortable:true	},
      // { name: 'Distributor Contact Name', selector: row => row.DistributorContactName,wrap	:true,sortable:true	},
      { name: 'Distributor Email', selector: row => row.DistributorEmail,wrap	:true,sortable:true	},
      { name: 'Project Code', selector: row => row.TenderCode,wrap	:true,sortable:true	},
      { name: 'Sector', selector: row => row.Sector,wrap	:true,sortable:true	},
      { name: 'Summary', selector: row => row.Summary,wrap	:true,sortable:true	},
      { name: 'Revenue', selector: row => row.Revenue,wrap	:true,sortable:true	},
      { name: 'Purchasing Decision Date', selector: row => row.PurchasingDecisionDate,wrap	:true,sortable:true	},
      { name: 'StartDate', selector: row => row.StartDate,wrap	:true,sortable:true	},
      { name: 'FinishDate', selector: row => row.FinishDate,wrap	:true,sortable:true}	,

  ];
  
  
    
    function handleChange(event) {
        const value = event.target.value;
        setformData(formData=>({
          ...formData,
          [event.target.name]: event.target.value
       }))
      }
        
           const getData = async () =>
        {
          const token = localStorage.getItem('access_token')
            
       await   fetch(process.env['REACT_APP_API_URL']+"/auth/tender/gettenders",{
           // mode:'cors',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
                    "Authorization" : 'Bearer '+token+''
          }
        },)
              .then(res => res.json())
              .then(
                (result) => {
                  setTenders(result)
                  setfilteredItems(result)
                },
                
                (error) => {
                
                }
              )
        }
    
        const editRow=(row) =>
                  {          

                    setformData(row);
                  }     
        
    
        const deleteRow = id => {
          if(window.confirm('Are you sure to delete this record?')){ 
            const token = localStorage.getItem('access_token')
           fetch(process.env['REACT_APP_API_URL']+"/auth/tender/delete/"+id, {
            method: 'get',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "Authorization" : 'Bearer '+token+''
            },
          }).then(getData()).then(setformData(initFormData)).then(alert("تم"));
          }
        }
        const handleSubmit = e => {
          e.preventDefault();
          const token = localStorage.getItem('access_token')
          
            if (formData.TenderId!='' && typeof formData.TenderId != "undefined") 
            {
               fetch(process.env['REACT_APP_API_URL']+"/auth/tender/update", {
                method: 'post',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  "Authorization" : 'Bearer '+token+''
                },
                body: JSON.stringify(formData),
              }).then(getData()).then( setformData(initFormData)).then(alert("تم"));
            }
            else
            {
             fetch(process.env['REACT_APP_API_URL']+"/auth/tender/create", {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Authorization" : 'Bearer '+token+''
              },
              body: JSON.stringify(formData),
            }).then(getData()).then(setformData(formData)).then(alert("تم"));;
          }
          
        };
          useEffect(() => {
           
            getData();
            
          const user = getUser()
          if (user.role=='Admin')
          {
            setIsAdmin(true)
          }
          else
          setIsAdmin(false)
          
          
          },[value]);
         useEffect(()=>
         {

          setfilteredItems(Tenders.filter(
            	item => item.EndUserCompanyName && item.EndUserCompanyName.toLowerCase().includes(filterText.toLowerCase()),
            	));
         },[filterText])
        //  const contextActions = React.useMemo(() => {
        //   		const handleDelete = () => {
          			
        //   			if (window.confirm(`Are you sure you want to delete:\r ${selectedRows.map(r => r.title)}?`)) {
        //   				setToggleCleared(!toggleCleared);
        //   				}
        //   		};
        //       const handleEdit = () => {
          			
        //   			if (window.confirm(`Are you sure you want to Edit:\r ${selectedRows.map(r => r.title)}?`)) {
        //   				setToggleCleared(!toggleCleared);
        //   				}
        //   		};
          
        //   		return (<>
        //   			<Button key="delete" onClick={handleDelete} style={{ color:'white',backgroundColor: 'red' }} icon>
        //   				Delete
        //   			</Button>
        //       </>
        //   		);
        //   	}, [data, selectedRows, toggleCleared]);
          //  const ManageSelections = () => {
          // 	const [selectedRows, setSelectedRows] = React.useState([]);
          //     	const [toggleCleared, setToggleCleared] = React.useState(false);
              
          //     	const handleRowSelected = React.useCallback(state => {
          //     //		setSelectedRows(state.selectedRows);
          //     	}, []);}
         return (
            <Container>
              {isAdmin?<></>:<Row>
              <Col lg="12" xs="12">
                 <Card>
          
                <CardHeader>
                <h1>Add Project</h1>
                </CardHeader>
                <CardBody>
                
                  <Form onSubmit={handleSubmit}>
                      
                  <Row>
                  <Col lg="4">
                        <div className='form-group'>              
                        <Label htmlFor="EndUserCompanyName">End User Company Name</Label>
                          <Input type="text"  onChange={handleChange} value={formData.EndUserCompanyName} name="EndUserCompanyName" placeholder="End User Company Name" autoComplete="EndUserCompanyName" /> 
                          </div>
                        </Col>
                        <Col lg="4">
                          <div className='form-group'>  
                        <Label htmlFor="EndUserContactName">End User Contact Name</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.EndUserContactName} name="EndUserContactName" placeholder="End User Contact Name" autoComplete="EndUserContactName" />
                          
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className='form-group'>  
                          
                        <Label htmlFor="EndUserContactPhone">End User Contact Phone</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.EndUserContactPhone} name="EndUserContactPhone" placeholder="End User Contact Phone" autoComplete="EndUserContactPhone" />
                          
                            </div>
                          </Col>
                          </Row>
                          <Row>
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="EndUserContactEmail">End User Contact Email</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.EndUserContactEmail} name="EndUserContactEmail" placeholder="End User Contact Email" autoComplete="EndUserContactEmail" />
                            </div>
                          </Col>
                          <Col lg="4">

<div className='form-group'>  

<Label htmlFor="Sector">Project Status</Label>
<select className='form-control' onChange={handleChange}  name="Status" value={formData.Status}> 
<option>Initial</option>
<option>Under negotiation</option>
<option>Confirmed</option>
<option>Lost</option>
</select>

</div>
</Col>
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="InstallationCity">Installation City</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.InstallationCity} name="InstallationCity" placeholder="Installation City" autoComplete="Installation City" />
                            </div>
                          </Col>
                         {/* <Col lg="4">
                             <div className='form-group'>  
                        <Label htmlFor="ResellerCompanyName">Reseller Company Name</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.ResellerCompanyName} name="ResellerCompanyName" placeholder="Reseller Company Name" autoComplete="ResellerCompanyName" />
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="ResellerContactName">Reseller Contact Name</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.ResellerContactName} name="ResellerContactName" placeholder="Reseller Contact Name" autoComplete="ResellerContactName" />
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="ResellerEmail">Reseller Email</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.ResellerEmail} name="ResellerEmail" placeholder="Reseller Email" autoComplete="ResellerEmail" />
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="DistributorCompanyName">Distributor Company Name</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.DistributorCompanyName} name="DistributorCompanyName" placeholder="Distributor Company Name" autoComplete="DistributorCompanyName" />
                            </div>
                          </Col> */}
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="DistributorContactName">Distributor Contact Name</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.DistributorContactName} name="DistributorContactName" placeholder="Distributor Contact Name" autoComplete="DistributorContactName" />
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="DistributorEmail">Distributor Email</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.DistributorEmail} name="DistributorEmail" placeholder="Distributor Email" autoComplete="DistributorEmail" />
                            </div>
                          </Col>
                          {/* <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="InstallationCity">Installation City</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.InstallationCity} name="InstallationCity" placeholder="Installation City" autoComplete="InstallationCity" />
                            </div>
                          </Col> */}
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="InstallationState">Installation State</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.InstallationState} name="InstallationState" placeholder="Installation State" autoComplete="InstallationState" />
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="Revenue"> Estimated Revenue</Label>
                        
                          <Input type="text" onChange={handleChange} value={formData.Revenue} name="Revenue" placeholder="Estimated Revenue" autoComplete="EstimatedRevenue" />
                            </div>
                          </Col>
                         

                      <Col lg="4">
                          
                          <div className='form-group'>  
                      <Label htmlFor="PurchasingDecisionDate">Estimated Business Purchasing Decision Date</Label>
                      
                        <Input type="date" onChange={handleChange} value={formData.PurchasingDecisionDate} name="PurchasingDecisionDate" placeholder="Purchasing Decision Date" autoComplete="PurchasingDecisionDate" />
                          </div>
                        </Col>
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="StartDate"> Estimated Implementation Start Date</Label>
                        
                          <Input type="date" onChange={handleChange} value={formData.StartDate} name="StartDate" autoComplete="StartDate" />
                            </div>
                          </Col>
                          <Col lg="4">
                            <div className='form-group'>  
                        <Label htmlFor="FinishDate"> Estimated Implementation Finish Date</Label>
                        
                          <Input type="date" onChange={handleChange} value={formData.FinishDate} name="FinishDate"  autoComplete="FinishDate" />
                            </div>
                          </Col>
                          
                      <Col lg="4">

                            <div className='form-group'>  
                      
                    <Label htmlFor="Sector">Sector</Label>
                      <select className='form-control' onChange={handleChange}  name="Sector" value={formData.Sector}> 
                        <option>Private</option>
                        <option>Government</option>
                      </select>
                      
                        </div>
                      </Col>
                      <Col lg="4">
                        <div className='form-group'>  
                      

                    <Label htmlFor="TenderCode">Project Code (Optional)</Label>
                    <Input type="text" onChange={handleChange} value={formData.TenderCode} name="TenderCode" placeholder="Project Code" autoComplete="TenderCode" />
                      
                        </div>
                      </Col>
                      <Col lg="4">

<div className='form-group'>  

<Label htmlFor="Summary">Summary</Label>
<textarea onChange={handleChange} className="form-control" value={formData.Summary} name="Summary" placeholder="Summary" autoComplete="Summary" >

</textarea>


</div>
</Col>
                      <Col lg="6">
                            <Button color="primary" className="btn btn-info">Save</Button>
                          </Col>
                          </Row>
                      </Form>
                  
                </CardBody>
                
              </Card>
              </Col>
            
          </Row>}
            <Row>
                <Col lg="12" xs="12">
                <Card>
                  <CardHeader>
                    <i className="fa fa-align-justify"></i> Projects List
                  </CardHeader>
                  <CardBody>
         
                  <DataTable responsive striped
            columns={columns}
            data={filteredItems}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            pagination
            actions
            fixedHeader	
           /* selectableRows
            contextActions={contextActions}*/
            defaultSortFieldId='TenderId'
            customStyles={customStyles}
        />               </CardBody>
                        </Card>
    
                </Col>
                </Row>
            </Container>
        
        );
       
                      }
