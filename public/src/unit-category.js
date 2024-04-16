import React, { useState,useEffect,useMemo } from 'react';
import { Button, Card, CardBody, CardGroup, Col, Container, Form, Input, 
  InputGroup, InputGroupAddon, InputGroupText, Row,Label,CardHeader,Table,
  Badge,Pagination,PaginationItem,PaginationLink} from 'reactstrap';
  import DataTable from 'react-data-table-component';

export default function Unit_Category() {
  const [filterText, setFilterText] = useState('');
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filteredItems,setfilteredItems]=useState([]) ;
  const [oldFilter,setOldFilter]=useState('');
  const [selectedRows, setSelectedRows] = React.useState([]);
	const [toggleCleared, setToggleCleared] = React.useState(false);



	
  let initFormData= { 
    name:'',
    status: 'Active'}

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
	const subHeaderComponentMemo = useMemo(() => {
		const handleClear = () => {
			if (filterText) {
				setResetPaginationToggle(!resetPaginationToggle);
				setFilterText('');
			}
		};

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
      { name: 'name', selector: row => row.name,wrap:true,sortable:true	},
      { name: 'status', selector: row => row.status.partner.CompanyName,wrap	:true,sortable:true	},
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
            
       await   fetch(process.env['REACT_APP_API_URL']+"/tender/gettenders",{
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
                                     <h1>Add Unit</h1>
                                 </CardHeader>
                                 <CardBody>
                                     <Form onSubmit={handleSubmit}>
                                         <Row>
                                             <Col lg="4">
                                                 <div className="form-group">
                                                     <Label htmlFor="name">
                                                         Name
                                                     </Label>
                                                     <Input
                                                         type="text"
                                                         onChange={handleChange}
                                                         value={formData.name}
                                                         name="name"
                                                         placeholder="Unit"
                                                     />
                                                 </div>
                                             </Col>

                                             <Col lg="6">
                                                 <div className="form-group">
                                                     <Label htmlFor="Status">
                                                         Status
                                                     </Label>
                                                     <select
                                                         className="form-control"
                                                         onChange={handleChange}
                                                         name="Status"
                                                         value={formData.Status}
                                                     >
                                                         <option>Active</option>
                                                         <option>
                                                             Inactive
                                                         </option>
                                                     </select>
                                                 </div>
                                             </Col>
                                         </Row>
                                         <Row>
                                             <Col lg="6">
                                                 <Button
                                                     color="primary"
                                                     className="btn btn-info"
                                                 >
                                                     Save
                                                 </Button>
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
                                 <i className="fa fa-align-justify"></i> Unit
                                 List
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
                                     defaultSortFieldId="name"
                                     customStyles={customStyles}
                                 />{" "}
                             </CardBody>
                         </Card>
                     </Col>
                 </Row>
             </Container>
         );
       }
