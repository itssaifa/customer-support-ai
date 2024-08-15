// src/components/FormattedMessage.js
import { Box, Typography } from "@mui/material";

const formatText = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  return lines.map((line, index) => {
    if (line.startsWith('### ')) {
      // Heading 3
      return <Typography key={index} variant="h6" component="div" sx={{ fontWeight: 'bold', mt: 2 }}>{line.replace('### ', '')}</Typography>;
    } else if (line.startsWith('## ')) {
      // Heading 2
      return <Typography key={index} variant="h5" component="div" sx={{ fontWeight: 'bold', mt: 2 }}>{line.replace('## ', '')}</Typography>;
    } else if (line.startsWith('# ')) {
      // Heading 1
      return <Typography key={index} variant="h4" component="div" sx={{ fontWeight: 'bold', mt: 2 }}>{line.replace('# ', '')}</Typography>;
    } else if (line.startsWith('- ')) {
      // Bullet point
      return <Typography key={index} variant="body1" sx={{ ml: 2, mt: 1 }}>• {line.replace('- ', '')}</Typography>;
    } else if (line.startsWith('* ')) {
      // Bullet point with a different symbol
      return <Typography key={index} variant="body1" sx={{ ml: 2, mt: 1 }}>• {line.replace('* ', '')}</Typography>;
    } else {
      // Regular text
      return <Typography key={index} variant="body1" sx={{ mt: 1 }}>{line}</Typography>;
    }
  });
};

const FormattedMessage = ({ content }) => {
  return (
    <Box sx={{ whiteSpace: 'pre-wrap' }}>
      {formatText(content)}
    </Box>
  );
};

export default FormattedMessage;
