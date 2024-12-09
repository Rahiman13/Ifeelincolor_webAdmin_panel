import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { styled } from '@mui/material/styles';
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import axios from "axios";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';

// Load Stripe with your publishable key
const stripePromise = loadStripe("pk_test_51QQ5mPEO0XTlFhbUdSBmDZ0dfl2fiMQVnCbB8mHQE8TTKxakT4ejqO2UDUGEbZe5zr6JSl9irEmIYpmYhc0vD3SV00dQ2x41fY");

// Styled Components
// Styled Components
const PageWrapper = styled('div')(({ theme }) => ({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)',
  padding: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '300px',
    background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
    transform: 'skewY(-6deg)',
    transformOrigin: 'top left',
  }
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  background: '#ffffff',
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
  padding: 0,
  overflow: 'hidden',
  position: 'relative',
  maxWidth: '550px',
  width: '100%',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.12)',
  }
}));

const FormHeader = styled(Box)(({ theme }) => ({
  background: '#fff',
  color: '#1a237e',
  padding: theme.spacing(4),
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
  position: 'relative',
}));

const FormContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  background: '#fff',
}));

const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#f8fafc',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: '#fff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1a237e',
      },
    },
    '&.Mui-focused': {
      backgroundColor: '#fff',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#1a237e',
        borderWidth: '2px',
      },
    }
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: '#e2e8f0',
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    '&.Mui-focused': {
      color: '#1a237e',
    }
  },
  marginBottom: theme.spacing(3),
}));

const CardContainer = styled(Box)(({ theme }) => ({
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: theme.spacing(3),
  backgroundColor: '#f8fafc',
  marginBottom: theme.spacing(3),
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#fff',
    borderColor: '#1a237e',
  }
}));

const PaymentButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
  borderRadius: '8px',
  padding: '12px 24px',
  color: 'white',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  letterSpacing: '0.5px',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #0d47a1 0%, #1a237e 100%)',
    boxShadow: '0 4px 12px rgba(26, 35, 126, 0.2)',
  },
  '&.Mui-disabled': {
    background: '#e2e8f0',
    color: '#94a3b8',
  }
}));

const StatusDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '16px',
    padding: theme.spacing(2),
    maxWidth: '400px',
    width: '100%'
  }
}));

const PaymentIdContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  background: '#f8fafc',
  padding: theme.spacing(2),
  borderRadius: '8px',
  marginTop: theme.spacing(2),
  '& .copy-button': {
    color: '#64748b',
    '&:hover': {
      color: '#1a237e',
    }
  }
}));

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCopyPaymentId = () => {
    navigator.clipboard.writeText(paymentId);
    setOpenSnackbar(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !amount || !customerName || !orderId) {
      alert("Please fill out all fields!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("https://rough-1-gcic.onrender.com/api/payment/create-payment-intent", {
        amount: parseFloat(amount),
        currency: "usd",
        payment_method_types: ["card"],
        email: email,
        metadata: {
          order_id: orderId,
          customer_name: customerName,
        },
      });

      const { clientSecret } = response.data;
      const cardElement = elements.getElement(CardElement);
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: customerName },
        },
      });

      if (error) {
        setPaymentStatus("Payment failed! " + error.message);
        setIsSuccess(false);
      } else {
        setPaymentStatus("Payment successful!");
        setPaymentId(paymentIntent.id);
        setIsSuccess(true);
      }
      setOpenDialog(true);
    } catch (err) {
      setPaymentStatus("Error occurred: " + err.message);
      setIsSuccess(false);
      setOpenDialog(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container maxWidth="sm">
        <FormContainer elevation={3}>
          <FormHeader>
            <Typography variant="h4" component="h2" fontWeight="bold" 
              sx={{ 
                textAlign: 'center',
                textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                position: 'relative',
                zIndex: 1
              }}>
              Secure Payment
            </Typography>
            <Typography variant="subtitle1" 
              sx={{ 
                textAlign: 'center', 
                mt: 1,
                opacity: 0.9,
                position: 'relative',
                zIndex: 1
              }}>
              Complete your transaction securely with Stripe
            </Typography>
          </FormHeader>
          
          <FormContent>
            <form onSubmit={handlePayment}>
              <StyledInput
                fullWidth
                label="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { fontSize: '1.1rem' }
                }}
              />
              <StyledInput
                fullWidth
                label="Order ID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { fontSize: '1.1rem' }
                }}
              />
              <StyledInput
                fullWidth
                label="Amount (USD)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1, color: '#666' }}>$</Typography>,
                  sx: { fontSize: '1.1rem' }
                }}
              />
              <StyledInput
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                InputProps={{
                  sx: { fontSize: '1.1rem' }
                }}
              />
              <CardContainer>
                <Typography variant="subtitle1" sx={{ mb: 2, color: '#666' }}>
                  Card Details
                </Typography>
                <CardElement options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                      padding: '10px 0',
                    },
                  },
                }} />
              </CardContainer>
              <PaymentButton
                fullWidth
                type="submit"
                disabled={!stripe || !elements || loading}
                startIcon={loading && <CircularProgress size={20} color="inherit" />}
              >
                {loading ? 'Processing...' : `Pay $${amount || '0'}`}
              </PaymentButton>
            </form>
            
            {paymentStatus && (
              <Typography
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: paymentStatus.includes('successful') ? 'rgba(72, 187, 120, 0.1)' : 'rgba(245, 101, 101, 0.1)',
                  color: paymentStatus.includes('successful') ? '#2f855a' : '#c53030',
                  border: `1px solid ${paymentStatus.includes('successful') ? '#48bb78' : '#f56565'}`,
                  textAlign: 'center',
                  fontSize: '1.1rem',
                  fontWeight: 500,
                }}
              >
                {paymentStatus}
              </Typography>
            )}
          </FormContent>
        </FormContainer>
      </Container>
      
      <StatusDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="payment-status-dialog"
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          color: isSuccess ? '#15803d' : '#b91c1c'
        }}>
          {isSuccess ? (
            <>
              <CheckCircleIcon color="success" />
              Payment Successful
            </>
          ) : (
            <>
              <ErrorIcon color="error" />
              Payment Failed
            </>
          )}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ color: '#1e293b' }}>
            {paymentStatus}
          </Typography>
          
          {isSuccess && paymentId && (
            <PaymentIdContainer>
              <Typography 
                variant="body2" 
                sx={{ 
                  flex: 1, 
                  fontFamily: 'monospace',
                  color: '#1e293b'
                }}
              >
                Payment ID: {paymentId}
              </Typography>
              <Tooltip title="Copy Payment ID">
                <IconButton 
                  className="copy-button"
                  onClick={handleCopyPaymentId}
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </PaymentIdContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: '#1a237e',
              '&:hover': {
                backgroundColor: 'rgba(26, 35, 126, 0.04)'
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </StatusDialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Payment ID copied to clipboard"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            bgcolor: '#1a237e',
            borderRadius: '8px'
          }
        }}
      />
    </PageWrapper>
  );
};

const StripePaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default StripePaymentPage;
