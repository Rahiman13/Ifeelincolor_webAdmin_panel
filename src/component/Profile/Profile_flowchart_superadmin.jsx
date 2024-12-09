import { useEffect, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  MiniMap 
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa';
import { Box, Typography, CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  flowContainer: {
    height: '800px',
    width: '100%',
    background: '#f8f9fa',
    borderRadius: theme.spacing(2),
    padding: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  nodeContent: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  nodeDetails: {
    textAlign: 'left',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  }
}));

const ProfileFlowchartSuperadmin = () => {
  const classes = useStyles();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminPortal = sessionStorage.getItem('adminPortal');
    const role = sessionStorage.getItem('role');
    const token = sessionStorage.getItem('token');

    if (adminPortal === 'true' && role === 'admin' && token) {
      fetchHierarchyData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchHierarchyData = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [adminRes, assistantsRes, cliniciansRes] = await Promise.all([
        axios.get('https://rough-1-gcic.onrender.com/api/admin/profile', { headers }),
        axios.get('https://rough-1-gcic.onrender.com/api/admin/assistants', { headers }),
        axios.get('https://rough-1-gcic.onrender.com/api/admin/doctors', { headers })
      ]);

      if (adminRes.data.status === 'success' && 
          assistantsRes.data.status === 'success' && 
          cliniciansRes.data.status === 'success') {
        createHierarchyChart(
          adminRes.data.body, 
          assistantsRes.data.body, 
          cliniciansRes.data.body
        );
      } else {
        toast.error('Failed to load some hierarchy data');
      }
    } catch (error) {
      console.error('Error fetching hierarchy data:', error);
      toast.error('Error loading hierarchy data');
    } finally {
      setLoading(false);
    }
  };

  const createHierarchyChart = (admin, assistants, clinicians) => {
    const newNodes = [];
    const newEdges = [];

    // Admin Node
    newNodes.push({
      id: 'admin',
      position: { x: 400, y: 50 },
      data: {
        label: (
          <Box className={classes.nodeContent}>
            {admin.image ? (
              <img 
                src={admin.image} 
                alt={admin.name}
                className={classes.profileImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  const icon = document.createElement('div');
                  icon.innerHTML = '<FaUserCircle size={40} />';
                  e.target.parentNode.appendChild(icon);
                }}
              />
            ) : (
              <FaUserCircle size={40} />
            )}
            <Box className={classes.nodeDetails}>
              <Typography variant="subtitle1">{admin.name}</Typography>
              <Typography variant="caption">{admin.companyName}</Typography>
            </Box>
          </Box>
        )
      },
      style: {
        background: 'linear-gradient(135deg, #4a90e2 0%, #357abd 100%)',
        padding: 10,
        borderRadius: 10,
        border: '2px solid #2d6da3',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: 250,
      }
    });

    // Assistant Nodes
    assistants.forEach((assistant, index) => {
      const xPos = (200 + (index * 300));
      newNodes.push({
        id: `assistant-${assistant._id}`,
        position: { x: xPos, y: 200 },
        data: {
          label: (
            <Box className={classes.nodeContent}>
              <FaUserCircle size={35} />
              <Box className={classes.nodeDetails}>
                <Typography variant="subtitle2">{assistant.name}</Typography>
                <Typography variant="caption">{assistant.email}</Typography>
              </Box>
            </Box>
          )
        },
        style: {
          background: 'linear-gradient(135deg, #82ca9d 0%, #5fb585 100%)',
          padding: 10,
          borderRadius: 8,
          border: '2px solid #4a9e6d',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: 220,
        }
      });

      newEdges.push({
        id: `edge-admin-${assistant._id}`,
        source: 'admin',
        target: `assistant-${assistant._id}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#4a9e6d', strokeWidth: 2 }
      });
    });

    // Clinician Nodes
    clinicians.forEach((clinician, index) => {
      const xPos = (100 + (index * 250));
      newNodes.push({
        id: `clinician-${clinician._id}`,
        position: { x: xPos, y: 350 },
        data: {
          label: (
            <Box className={classes.nodeContent}>
              <FaUserCircle size={30} />
              <Box className={classes.nodeDetails}>
                <Typography variant="subtitle2">{clinician.name}</Typography>
                <Typography variant="caption">{clinician.specializedIn}</Typography>
              </Box>
            </Box>
          )
        },
        style: {
          background: 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)',
          padding: 8,
          borderRadius: 8,
          border: '2px solid #f57c00',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: 200,
        }
      });

      // Connect to nearest assistant
      const assistantIndex = Math.floor(index % assistants.length);
      newEdges.push({
        id: `edge-assistant-${clinician._id}`,
        source: `assistant-${assistants[assistantIndex]._id}`,
        target: `clinician-${clinician._id}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#f57c00', strokeWidth: 2 }
      });
    });

    setNodes(newNodes);
    setEdges(newEdges);
  };

  if (loading) {
    return (
      <Box className={classes.loadingContainer}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className={classes.flowContainer}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap 
          nodeStrokeColor={(n) => {
            if (n.style?.background) return n.style.background;
            return '#eee';
          }}
          nodeColor={(n) => {
            if (n.style?.background) return n.style.background;
            return '#fff';
          }}
        />
      </ReactFlow>
    </Box>
  );
};

export default ProfileFlowchartSuperadmin;
