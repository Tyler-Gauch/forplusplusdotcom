import React, {useState} from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { API, graphqlOperation } from 'aws-amplify';
import { updateCourse } from '../../graphql/mutations';
import { encodeTitleToId } from '../util/encoders';
import { useHistory } from 'react-router-dom';


const NewVideoModal = ({onSuccess}) => {

    const history = useHistory();

    const [show, setShow] = useState(false);
    const [validated, setValidated] = useState(false);
    const [newVideoTitle, setNewVideoTitle] = useState("");
    const [newVideoUrl, setNewVideoUrl] = useState("");
    const [newThumbnailUrl, setNewThumbnailUrl] = useState("");
    const [newVideoDesc, setNewVideoDesc] = useState("");
    const [newVideoId, setNewVideoId] = useState("");
    const [error, setError] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleNewTitle = (event) => {
        setNewVideoId(encodeTitleToId(event.target.value));
        setNewVideoTitle(event.target.value);
    };
    const handleNewVideoUrl = (event) => setNewVideoUrl(event.target.value);
    const handleNewDesc = (event) => setNewVideoDesc(event.target.value);
    const handleNewThumbnailUrl = (event) => setNewThumbnailUrl(event.target.value);

    const handleSubmit = async (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();

      if (form.checkValidity() === false) {
        return;
      }
  
      setValidated(true);

      const input = {
            id: newVideoId,
            title: newVideoTitle,
            description: newVideoDesc,
            thumbnailUrl: newThumbnailUrl,
            videoSrc: newVideoUrl,
            adminOnly: true
      };

      handleClose();
      onSuccess(input);
    };

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add new video
            </Button>

            <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create new video</Modal.Title>
            </Modal.Header>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Modal.Body>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Video Title" onChange={handleNewTitle} />
                        </Form.Group>
                        <Form.Group controlId="formVideoUrl">
                            <Form.Label>Video Url</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Video Url" onChange={handleNewVideoUrl}/>
                        </Form.Group>
                        <Form.Group controlId="formThumbnailUrl">
                            <Form.Label>Thumbnail Url</Form.Label>
                            <Form.Control required type="text" placeholder="Enter Thumbnail Url" onChange={handleNewThumbnailUrl}/>
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

export default NewVideoModal;