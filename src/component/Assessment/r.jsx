import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, Modal, Form } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
// import axios from 'axios';
import './TestsPage_r.scss';

const dummyTestData = [
  {
    id: 1,
    date: '2024-08-01',
    batch: 'Batch A',
    createdBy: 'Admin',
    testPaper: 'This is the test paper content for test 1.',
    questions: [
      { type: 'MCQ', question: 'What is React?', options: ['A Library', 'A Framework'], correctAnswer: 'A Library' }
    ]
  },
  {
    id: 2,
    date: '2024-08-15',
    batch: 'Batch B',
    createdBy: 'Admin',
    testPaper: 'This is the test paper content for test 2.',
    questions: [
      { type: 'Blank', question: 'What is a component?', answer: 'A piece of UI', image: '' }
    ]
  },
  // Add more dummy data here
];

export default function TestsPage() {
  const [tests, setTests] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [formData, setFormData] = useState({ date: '', batch: '', createdBy: '', questions: [] });
  const [imageFiles, setImageFiles] = useState({});


  useEffect(() => {
    // Simulate API call to fetch tests
    setTests(dummyTestData);
  }, []);

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => {
    setFormData({ date: '', batch: '', createdBy: '', questions: [] });
    setImageFiles({});
    setShowCreateModal(false);
  };

  const handleShowViewModal = (test) => {
    setSelectedTest(test);
    setShowViewModal(true);
  };
  const handleCloseViewModal = () => setShowViewModal(false);

  const handleShowEditModal = (test) => {
    setSelectedTest(test);
    setFormData({
      date: test.date,
      batch: test.batch,
      createdBy: test.createdBy,
      questions: test.questions
    });
    setImageFiles({});
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setFormData({ date: '', batch: '', createdBy: '', questions: [] });
    setImageFiles({});
    setShowEditModal(false);
  };

  const handleCreateTest = async () => {
    try {
      // Simulate API call to create a test
      // await axios.post('/api/tests', formData);
      setTests([...tests, { ...formData, id: tests.length + 1 }]);
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  const handleEditTest = async () => {
    try {
      // Simulate API call to update a test
      // await axios.put(`/api/tests/${selectedTest.id}`, formData);
      setTests(tests.map(test => (test.id === selectedTest.id ? { ...test, ...formData } : test)));
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  const handleDeleteTest = async (id) => {
    try {
      // Simulate API call to delete a test
      // await axios.delete(`/api/tests/${id}`);
      setTests(tests.filter(test => test.id !== id));
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = formData.questions.map((q, i) =>
      i === index ? { ...q, [e.target.name]: e.target.value } : q
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const handleAddQuestion = (type) => {
    const newQuestion = { type, question: '', image: '' };
    if (type === 'MCQ') {
      newQuestion.options = ['', ''];
      newQuestion.correctAnswer = '';
    } else if (type === 'Blank') {
      newQuestion.answer = '';
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageFiles({
        ...imageFiles,
        [index]: reader.result
      });
      const updatedQuestions = formData.questions.map((q, i) =>
        i === index ? { ...q, image: reader.result } : q
      );
      setFormData({ ...formData, questions: updatedQuestions });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleOptionChange = (qIndex, optIndex, e) => {
    const updatedQuestions = formData.questions.map((q, i) =>
      i === qIndex
        ? {
          ...q,
          options: q.options.map((opt, j) => (j === optIndex ? e.target.value : opt)),
        }
        : q
    );
    setFormData({ ...formData, questions: updatedQuestions });
  };

  return (
    <div className="tests-page">
      <Container fluid className="py-5">
        <Button variant="primary" onClick={handleShowCreateModal} className="mb-4">Create Test</Button>
        <Row>
          {tests.map(test => (
            <Col md={4} key={test.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>Test on {test.date}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{test.batch}</Card.Subtitle>
                  <Card.Text>
                    Created By: {test.createdBy}
                  </Card.Text>
                  <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleShowViewModal(test)}>View</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleShowEditModal(test)}>Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeleteTest(test.id)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Create Test Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate" className='mb-2'>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formBatch" className='mb-2'>
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formCreatedBy" className='mb-3'>
              <Form.Label>Created By</Form.Label>
              <Form.Control type="text" value={formData.createdBy} onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Question Type: </Form.Label>
              {formData.questions.map((q, index) => (
                <div key={index} className="mb-3">
                  <Form.Control
                    type="text"
                    name="question"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e)}
                    className="mb-2"
                  />
                  {q.type === 'MCQ' && (
                    <>
                      {q.options.map((option, optIndex) => (
                        <Form.Control
                          key={optIndex}
                          type="text"
                          placeholder={`Option ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, optIndex, e)}
                          className="mb-2"
                        />
                      ))}
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            questions: formData.questions.map((quest, i) =>
                              i === index
                                ? {
                                  ...quest,
                                  options: [...quest.options, ''],
                                }
                                : quest
                            ),
                          })
                        }
                        className="mb-2"
                      >
                        Add Option
                      </Button>
                      <Form.Control
                        as="select"
                        value={q.correctAnswer}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            questions: formData.questions.map((quest, i) =>
                              i === index ? { ...quest, correctAnswer: e.target.value } : quest
                            ),
                          })
                        }
                        className="mb-2"
                      >
                        <option value="">Select Correct Answer</option>
                        {q.options.map((option, optIndex) => (
                          <option key={optIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Control>
                    </>
                  )}
                  {q.type === 'Blank' && (
                    <>
                      <Form.Control
                        type="text"
                        placeholder="Answer"
                        name="answer"
                        value={q.answer}
                        onChange={(e) => handleQuestionChange(index, e)}
                        className="mb-2"
                      />
                      <Form.Group className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(index, e)}
                        />
                        {imageFiles[index] && (
                          <img
                            src={imageFiles[index]}
                            alt={`Question ${index} preview`}
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                            className="mt-2"
                          />
                        )}
                      </Form.Group>
                    </>
                  )}

                  {/* <Form.Group className='mt-2'>
                                        <Form.Label>Upload Image (if any)</Form.Label>
                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageChange(index, e)}
                                            className="border-gray-300 rounded-md shadow-sm"
                                        />
                                    </Form.Group> */}
                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        questions: formData.questions.filter((_, i) => i !== index),
                      })
                    }
                    className="mb-2"
                  >
                    Remove Question
                  </Button>
                </div>
              ))}
              <Button
                variant="outline-primary"
                onClick={() => handleAddQuestion('MCQ')}
                className="mb-2"
              >
                MCQ
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleAddQuestion('Blank')}
                className="mb-2"
              >
                Blank
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateTest}>
            Save Test
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Test Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal}>
        <Modal.Header closeButton>
          <Modal.Title>View Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTest && (
            <div>
              <h5>Date: {selectedTest.date}</h5>
              <h6>Batch: {selectedTest.batch}</h6>
              <p>Created By: {selectedTest.createdBy}</p>
              <h6>Test Paper:</h6>
              <p>{selectedTest.testPaper}</p>
              <h6>Questions:</h6>
              {selectedTest.questions.map((q, index) => (
                <div key={index} className="mb-3">
                  <p><strong>Question:</strong> {q.question}</p>
                  {q.type === 'MCQ' && (
                    <ul>
                      {q.options.map((option, optIndex) => (
                        <li key={optIndex}>{option}</li>
                      ))}
                      <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                    </ul>
                  )}
                  {q.type === 'Blank' && (
                    <p><strong>Answer:</strong> {q.answer}</p>
                  )}
                  {q.image && (
                    <img
                      src={q.image}
                      alt={`Question ${index} image`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      className="mt-2"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Test Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formBatch">
              <Form.Label>Batch</Form.Label>
              <Form.Control
                type="text"
                value={formData.batch}
                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formCreatedBy">
              <Form.Label>Created By</Form.Label>
              <Form.Control
                type="text"
                value={formData.createdBy}
                onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Questions</Form.Label>
              {formData.questions.map((q, index) => (
                <div key={index} className="mb-3">
                  <Form.Control
                    type="text"
                    name="question"
                    placeholder="Question"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, e)}
                    className="mb-2"
                  />
                  {q.type === 'MCQ' && (
                    <>
                      {q.options.map((option, optIndex) => (
                        <Form.Control
                          key={optIndex}
                          type="text"
                          placeholder={`Option ${optIndex + 1}`}
                          value={option}
                          onChange={(e) => handleOptionChange(index, optIndex, e)}
                          className="mb-2"
                        />
                      ))}
                      <Button
                        variant="outline-secondary"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            questions: formData.questions.map((quest, i) =>
                              i === index
                                ? {
                                  ...quest,
                                  options: [...quest.options, ''],
                                }
                                : quest
                            ),
                          })
                        }
                        className="mb-2"
                      >
                        Add Option
                      </Button>
                      <Form.Control
                        as="select"
                        value={q.correctAnswer}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            questions: formData.questions.map((quest, i) =>
                              i === index ? { ...quest, correctAnswer: e.target.value } : quest
                            ),
                          })
                        }
                        className="mb-2"
                      >
                        <option value="">Select Correct Answer</option>
                        {q.options.map((option, optIndex) => (
                          <option key={optIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </Form.Control>
                    </>
                  )}
                  {q.type === 'Blank' && (
                    <Form.Control
                      type="text"
                      placeholder="Answer"
                      name="answer"
                      value={q.answer}
                      onChange={(e) => handleQuestionChange(index, e)}
                      className="mb-2"
                    />
                  )}
                  <Form.Group className="mb-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(index, e)}
                    />
                    {imageFiles[index] && (
                      <img
                        src={imageFiles[index]}
                        alt={`Question ${index} preview`}
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        className="mt-2"
                      />
                    )}
                  </Form.Group>
                  <Button
                    variant="outline-danger"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        questions: formData.questions.filter((_, i) => i !== index),
                      })
                    }
                    className="mb-2"
                  >
                    Remove Question
                  </Button>
                </div>
              ))}
              <Button
                variant="outline-primary"
                onClick={() => handleAddQuestion('MCQ')}
                className="mb-2"
              >
                Add MCQ Question
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleAddQuestion('Blank')}
                className="mb-2"
              >
                Add Blank Question
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditTest}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
