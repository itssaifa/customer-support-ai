'use client'
import { Box, Stack, TextField, Button, Avatar, Typography, Modal, TextareaAutosize } from "@mui/material";
import { useState, useRef, useEffect } from "react";
import FormattedMessage from "../components/FormattedMessage"; // Adjusted import path
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Import the icon

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Assalamualaikum! I'm your Islamic Knowledge Assistant. Whether you have questions about prayers, the lives of the prophets, Quranic verses, Islamic practices, or general Islamic beliefs, I'm here to help. How can I assist you in learning more about Islam today?`,
    },
  ]);
  const [message, setMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0); // Add rating state
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {
    if (message.trim() === '') return;

    const newMessages = [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' },
    ];

    setMessages(newMessages);
    setMessage('');

    // Check if the user said "thank you"
    if (message.toLowerCase().includes('thank you')) {
      setShowFeedback(true);
    }

    try {
      const response = await fetch('/api/chat', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessages),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      return reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Uint8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text,
            },
          ];
        });
        return reader.read().then(processText);
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  };

  const handleFeedbackSubmit = (event) => {
    event.preventDefault();
    
    // Create a FormData object to send the form data
    const formData = new FormData(event.target);
    formData.append('rating', rating); // Add rating to the form data

    fetch('https://formspree.io/f/xblrkrkb', { // Replace with your Formspree form ID
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    })
    .then(response => {
      if (response.ok) {
        console.log('Feedback successfully submitted.');
        setShowFeedback(false);
        setFeedback('');
        setRating(0); // Reset rating
      } else {
        console.error('Failed to submit feedback.');
      }
    })
    .catch(error => {
      console.error('Error submitting feedback:', error);
    });
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
      sx={{
        backgroundImage: 'url(/images/1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Box
        width={{ xs: '90%', sm: '80%', md: '60%' }}
        maxWidth="600px"
        mb={2}
        sx={{
          backgroundColor: '#000720', // Changed header color
          color: 'white',
          borderRadius: '12px 12px 0 0',
          padding: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography 
          variant="h6" 
          component="div"
          sx={{ textAlign: 'center' }}
        >
          🌙 Your Islamic Knowledge Companion 🌙
        </Typography>
      </Box>

      <Stack
        direction={'column'}
        width={{ xs: '90%', sm: '80%', md: '60%' }}
        maxWidth="600px"
        height="80vh"
        border="1px solid #ddd"
        p={2}
        spacing={2}
        display="flex"
        flexDirection="column"
        sx={{
          backgroundColor: '#90cbf9', // Changed chat box background color
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack 
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          ref={chatContainerRef}
        >
          {messages.map((message, index) => (
            <Box 
              key={index} 
              display='flex' 
              justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              p={1}
            >
              {message.role === 'assistant' && (
                <Avatar 
                  src="/images/9.png"
                  alt="Assistant"
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    marginRight: 1,
                    alignSelf: 'flex-start'
                  }}
                />
              )}
              <Box
                bgcolor={message.role === 'assistant' ? '#007bff' : '#28a745'} // Changed colors for messages
                color='black'
                borderRadius='20px'
                p={2}
                maxWidth="80%"
                sx={{ 
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
                  wordBreak: 'break-word'
                }}
              >
                <FormattedMessage content={message.content} />
              </Box>
              {message.role === 'user' && (
                <Avatar 
                  src="/images/9.png"
                  alt="User"
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    marginLeft: 1,
                    alignSelf: 'flex-end'
                  }}
                />
              )}
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="Type a message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            variant="outlined"
            size="small"
            sx={{ borderRadius: '20px', backgroundColor: '#ffffff', color: '#000000' }} // Adjusted input background and text color
          />
          {message.trim() && (
            <Button 
              variant="contained" 
              color="primary" 
              onClick={sendMessage}
              sx={{ 
                borderRadius: '20px',
                paddingX: 1.5, // Adjust padding to fit icon and text
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Send
              <ArrowForwardIcon sx={{ marginLeft: 0.5 }} /> {/* Adjust margin for closer spacing */}
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Feedback Modal */}
      <Modal
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          component="form"
          onSubmit={handleFeedbackSubmit}
          sx={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: 3,
            width: '320px', // Adjusted width for better spacing
            boxShadow: 24,
            textAlign: 'center', // Center align text
          }}
        >
          <Typography variant="h6" gutterBottom>Feedback💡</Typography>
          
          {/* Star Rating */}
          <Box display="flex" justifyContent="center" mb={3}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                onClick={() => setRating(star)}
                sx={{
                  minWidth: 'unset',
                  margin: '0 4px', // Increased margin for better spacing
                  padding: 0, // Remove padding
                  fontSize: '24px', // Increased font size for larger stars
                  color: star <= rating ? '#ffb400' : '#ddd',
                }}
              >
                ★
              </Button>
            ))}
          </Box>
          
          <TextareaAutosize
            minRows={4}
            placeholder="Let me know what you think!"
            name="feedback" // Name attribute for Formspree
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{ width: '100%', marginBottom: '16px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button onClick={() => setShowFeedback(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
          </Stack>
        </Box>
      </Modal>
    </Box>
  );
}
