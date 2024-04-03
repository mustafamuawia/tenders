import React, { useState,useEffect,useMemo } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, 
  InputGroup, InputGroupAddon, InputGroupText, Row,Label,FormGroup,CardHeader,Table,
  Badge,Pagination,PaginationItem,PaginationLink} from 'reactstrap';
  import DataTable from 'react-data-table-component';

export default function Clients() {
  const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredItems,setfilteredItems]=useState([]) ;
  const [oldFilter,setOldFilter]=useState('')
  const [selectedRows, setSelectedRows] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Fetch countries data from REST Countries API
    fetch('https://restcountries.com/v3.1/all')
      .then((response) => response.json())
      .then((data) => {
        // Extract country names from the response
        const countryNames = data.map((country) => country.name.common);
        // Set the countries array state
        setCountries(countryNames);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []); 


	
  let initFormData= { 
    id: '',
   clientName: '',
   phone: '',
   address: '',
   country: '',
   state: '',
   city: '',
   partnerName: 0,
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
    const [Clients, setClients] = useState([]);
    const [value,setValue] = useState('')
    const [isAdmin,setIsAdmin] = useState(false)

    function getUser()  
    {
      var user = localStorage.getItem('user')
      return JSON.parse(user);
    }
    const columns = [
        {
                  selector: row => row.id,
                  cell: (row) => <>
          <button name={row.id} className='btn btn-danger' style={{display: 'block !important',
              width:'100%'}} onClick={(()=>deleteRow(row.id))}>Delete</button>
           {!isAdmin?<button name={row.id} style={{display: 'block !important',
              width:'100%'}} className='btn btn-info' onClick={(()=>editRow(row))}>Edit</button>:<></>}
          </>,
                  ignoreRowClick: true,
                  allowOverflow: true,
                  button: true,
              },
        { name: 'ID', selector: row => row.id,wrap	:true,sortable:true	},
        { name: 'clientName', selector: row => row.user.clientName.CompanyName,wrap	:true,sortable:true	},
        { name: 'Project Title', selector: row => row.ProjectTitle,wrap	:true,sortable:true	},
        { name: 'Client Name', selector: row => row.ClientName,wrap	:true,sortable:true	},
        { name: 'Country', selector: row => row.Country,wrap	:true,sortable:true	},
        { name: 'PartnerName', selector: row => row.PartnerName,wrap	:true,sortable:true	},
        { name: 'State', selector: row => row.State,wrap	:true,sortable:true	},
        { name: 'Installation City', selector: row => row.InstallationCity,wrap	:true,sortable:true	},
        { name: 'Project Status', selector: row => row.Status,wrap	:true,sortable:true	},
        
        { name: 'Address', selector: row => row.Address,wrap	:true,sortable:true	},
        { name: 'Created By', selector: row => row.created_by,wrap	:true,sortable:true	},
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
            
       await   fetch(process.env['REACT_APP_API_URL']+"/client/getclients",{
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
                  setClients(result)
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
           fetch(process.env['REACT_APP_API_URL']+"/auth/client/delete/"+id, {
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
          
            if (formData.id!='' && typeof formData.id != "undefined") 
            {
               fetch(process.env['REACT_APP_API_URL']+"/auth/client/update", {
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
             fetch(process.env['REACT_APP_API_URL']+"/auth/client/create", {
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

          setfilteredItems(Clients.filter(
            	item => item.ProjectTitle && item.ProjectTitle.toLowerCase().includes(filterText.toLowerCase()),
            	));
         },[filterText])

         return (
<Container>
  {isAdmin ? (
    <></>
  ) : (
    <Row>
      <Col lg="12" xs="12">
        <Card>
          <CardHeader>
            <h1>Add Client</h1>
          </CardHeader>
          <CardBody>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col lg="4">
                  <div className='form-group'>              
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input type="text" onChange={handleChange} value={formData.clientName} name="clientName" placeholder="Client Name" autoComplete="Client Name" /> 
                  </div>
                </Col>

                <Col lg="4">
                  <div className='form-group'>  
                    <Label htmlFor="phone">Phone</Label>
                    <Input type="tel" onChange={handleChange} value={formData.phone} name="phone" placeholder="Phone" autoComplete="Phone" />
                  </div>
                </Col>

                <Col lg="4">
                  <div className='form-group'>  
                    <Label htmlFor="address">Address</Label>
                    <Input type="text" onChange={handleChange} value={formData.address} name="address" placeholder="Address" autoComplete="Address" />
                  </div>
                </Col>

                <Col lg="4">
                <div className='form-group'>
        <Label htmlFor="Country">Country</Label>
        <select className='form-control' onChange={handleChange} name="Country" value={formData.Country}>
          <option value="">Select a country</option>
          {countries.map((country, index) => (
            <option key={index} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
                </Col>

                <Col lg="4">
                  <div className='form-group'>  
                    <Label htmlFor="state">State</Label>
                    <Input type="text" onChange={handleChange} value={formData.state} name="state" placeholder="State" autoComplete="State" />
                  </div>
                </Col>

                <Col lg="4">
                  <div className='form-group'>  
                    <Label htmlFor="city">City</Label>
                    <Input type="text" onChange={handleChange} value={formData.city} name="city" placeholder="City" autoComplete="City" />
                  </div>
                </Col>

                <Col lg="4">

<div className='form-group'>  

<Label htmlFor="Status">Status</Label>
<select className='form-control' onChange={handleChange}  name="Status" value={formData.Status}> 
<option>Initial</option>
<option>Under negotiation</option>
<option>Confirmed</option>
<option>Lost</option>
</select>

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
    </Row>
  )}
  
  <Row>
    <Col lg="12" xs="12">
      <Card>
        <CardHeader>
          <i className="fa fa-align-justify"></i> Clients List
        </CardHeader>
        <CardBody>
          <DataTable
            responsive
            striped
            columns={columns}
            data={filteredItems}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            pagination
            actions
            fixedHeader
            defaultSortFieldId='id'
            customStyles={customStyles}
          />
        </CardBody>
      </Card>
    </Col>
  </Row>
</Container>

        
        );
       
                      }
