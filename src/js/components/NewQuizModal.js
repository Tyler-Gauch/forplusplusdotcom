import React, {useState} from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { API, graphqlOperation } from 'aws-amplify';
import { createQuiz } from '../../graphql/mutations';
import { useHistory } from 'react-router-dom';
import { buildCourseUrl } from '../util/url-builders';


const NewCourseModal = () => {

    const history = useHistory();

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [newQuiz, setNewQuiz] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();

      if (form.checkValidity() === false) {
        return;
      }
  
      setValidated(true);

      API.graphql(graphqlOperation(createQuiz, {input: newQuiz}))
        .then(() => {
            setSuccess("Quiz created");
        })
        .catch(e => {
            setError("Error adding quiz: " + JSON.stringify(e));
        });
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add quiz
            </Button>

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create new quiz</Modal.Title>
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