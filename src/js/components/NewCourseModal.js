import React, {useState} from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { API, graphqlOperation } from 'aws-amplify';
import { createCourse } from '../../graphql/mutations';
import { encodeTitleToId } from '../util/encoders';
import { useHistory } from 'react-router-dom';
import { buildCourseUrl } from '../util/url-builders';


const NewCourseModal = () => {

    const history = useHistory();

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [newCourseTitle, setNewCourseTitle] = useState("");
    const [newCourseShortDesc, setNewCourseShortDesc] = useState("");
    const [newCourseDesc, setNewCourseDesc] = useState("");
    const [newCourseId, setNewCourseId] = useState("");
    const [error, setError] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleNewTitle = (event) => {
        setNewCourseId(encodeTitleToId(event.target.value));
        setNewCourseTitle(event.target.value);
    };
    const handleNewShortDesc = (event) => setNewCourseShortDesc(event.target.value);
    const handleNewDesc = (event) => setNewCourseDesc(event.target.value);

    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();

      if (form.checkValidity() === false) {
        return;
      }
  
      setValidated(true);

      const input = {
            id: newCourseId,
            title: newCourseTitle,
            shortDescription: newCourseShortDesc,
            description: newCourseDesc,
            videos: [],
            adminOnly: true
      };

      API.graphql(graphqlOperation(createCourse, {input: input}))
        .then(() => {
            history.push(buildCourseUrl(newCourseId));
        })
        .catch(e => {
            setError("Error adding course: " + JSON.stringify(e));
        });
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add new course
            </Button>

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create new course</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Course Title" onChange={handleNewTitle} />
                        </Form.Group>
                        <Form.Group controlId="formShortDescription">
                            <Form.Label>Short Description</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Short Description" onChange={handleNewShortDesc}/>
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control required as="textarea" rows={3} onChange={handleNewDesc} />
                        </Form.Group>
                    
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" type="submit">Create</Button>
                </Modal.Footer>
            </Form>
            </Modal>
        </>
    );
};

export default NewCourseModal;