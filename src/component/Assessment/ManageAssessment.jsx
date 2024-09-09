import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Dropdown, Modal, Form } from 'react-bootstrap';
import { FaEllipsisV, FaPlus, FaEdit, FaTrashAlt, FaEye } from 'react-icons/fa';
import './TestsPage.scss'

const dummyTestData = [
  {
    id: 1,
    date: '2024-08-01',
    category: 'Depression',
    createdBy: 'Admin',
    testPaper: 'This is the test paper content for test 1.',
    questions: [
      { type: 'MCQ', question: 'What is React?', options: ['A Library', 'A Framework'], correctAnswer: 'A Library' }
    ]
  },
  {
    id: 2,
    date: '2024-08-15',
    category: 'Stress',
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
  const [formData, setFormData] = useState({ date: '', category: '', createdBy: '', questions: [] });
  const [imageFiles, setImageFiles] = useState({});

  useEffect(() => {
    setTests(dummyTestData);
  }, []);

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => {
    setFormData({ date: '', category: '', createdBy: '', questions: [] });
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
      category: test.category,
      createdBy: test.createdBy,
      questions: test.questions
    });
    setImageFiles({});
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setFormData({ date: '', category: '', createdBy: '', questions: [] });
    setImageFiles({});
    setShowEditModal(false);
  };

  const handleCreateTest = async () => {
    if (!formData.date || !formData.category || !formData.createdBy || !formData.questions.length) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      setTests([...tests, { ...formData, id: tests.length + 1 }]);
      handleCloseCreateModal();
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };

  const handleEditTest = async () => {
    try {
      setTests(tests.map(test => (test.id === selectedTest.id ? { ...test, ...formData } : test)));
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating test:', error);
    }
  };

  const handleDeleteTest = async (id) => {
    try {
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
    } else if (type === 'Video') {
      newQuestion.videoLink = '';
      newQuestion.options = ['', ''];
      newQuestion.correctAnswer = '';
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion]
    });
  };

  const handleImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
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
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file');
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
    <div className="tests-page p-3">
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-clipboard-text fs-5"></i>
          </span> Test Management </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span>
                Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
              </span>
            </li>
          </ul>
        </nav>
      </div>
      <Container fluid >
        <div className='add-btn'>
          <Button variant="primary" onClick={handleShowCreateModal} className="test-btn mb-4 float-right"><FaPlus /> Create Test</Button>
        </div>
        <Row>
          {tests.map(test => (
            <Col md={4} key={test.id} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>Test on {test.date}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{test.category}</Card.Subtitle>
                  <Card.Text>
                    Created By: {test.createdBy}
                  </Card.Text>
                  <Dropdown className='test-dropdown'>
                    <Dropdown.Toggle variant="secondary" className='test-dropdown-toggle' id="dropdown-basic">
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='test-dropdown-toggle'>
                      <Dropdown.Item onClick={() => handleShowViewModal(test)}><FaEye /> View</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleShowEditModal(test)}><FaEdit /> Edit</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeleteTest(test.id)}><FaTrashAlt /> Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Create Test Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Create Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDate" className='mb-2'>
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formcategory" className='mb-2'>
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
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
                      <Button
                        variant="outline-secondary"
                        onClick={() => setFormData({
                          ...formData,
                          questions: formData.questions.map((q, i) =>
                            i === index ? { ...q, options: q.options.slice(0, -1) } : q
                          )
                        })}
                      >
                        Remove Option
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
                  {q.type === 'Video' && (
                    <>
                      <Form.Control
                        type="text"
                        placeholder="Video Link"
                        name="videoLink"
                        value={q.videoLink}
                        onChange={(e) => handleQuestionChange(index, e)}
                        className="mb-2"
                      />
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
                      <Button
                        variant="outline-secondary"
                        onClick={() => setFormData({
                          ...formData,
                          questions: formData.questions.map((q, i) =>
                            i === index ? { ...q, options: q.options.slice(0, -1) } : q
                          )
                        })}
                      >
                        Remove Option
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
                className="mb-2 mr-2"
              >
                MCQ
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleAddQuestion('Blank')}
                className="mb-2 mr-2"
              >
                Blank
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleAddQuestion('Video')}
                className="mb-2"
              >
                Video
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseCreateModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateTest}>
            Save Test
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Test Modal */}
      <Modal show={showViewModal} onHide={handleCloseViewModal} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>View Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTest && (
            <div>
              <h5>Date: {selectedTest.date}</h5>
              <h6>Category: {selectedTest.category}</h6>
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
                  {q.type === 'Video' && (
                    <>
                      <p><strong>Video Link:</strong> {q.videoLink}</p>
                      <ul>
                        {q.options.map((option, optIndex) => (
                          <li key={optIndex}>{option}</li>
                        ))}
                        <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
                      </ul>
                    </>
                  )}
                  {q.image && (
                    <img
                      src={q.image}
                      alt={`Preview of question ${index} answer`}
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
          <Button variant="danger" onClick={handleCloseViewModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Test Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} size='lg'>
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
            <Form.Group controlId="formcategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                      <Button
                        variant="outline-secondary"
                        onClick={() => setFormData({
                          ...formData,
                          questions: formData.questions.map((q, i) =>
                            i === index ? { ...q, options: q.options.slice(0, -1) } : q
                          )
                        })}
                      >
                        Remove Option
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
                  {q.type === 'Video' && (
                    <>
                      <Form.Control
                        type="text"
                        placeholder="Video Link"
                        name="videoLink"
                        value={q.videoLink}
                        onChange={(e) => handleQuestionChange(index, e)}
                        className="mb-2"
                      />
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
                      <Button
                        variant="outline-secondary"
                        onClick={() => setFormData({
                          ...formData,
                          questions: formData.questions.map((q, i) =>
                            i === index ? { ...q, options: q.options.slice(0, -1) } : q
                          )
                        })}
                      >
                        Remove Option
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
                className="mb-2 mr-2"
              >
                Add MCQ Question
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleAddQuestion('Blank')}
                className="mb-2 mr-2"
              >
                Add Blank Question
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => handleAddQuestion('Video')}
                className="mb-2"
              >
                Add Video Question
              </Button>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseEditModal}>
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