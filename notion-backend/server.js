const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Your Notion credentials
const NOTION_TOKEN = process.env.NOTION_TOKEN || 'your-notion-token-here';
const DATABASE_ID = process.env.DATABASE_ID || 'your-database-id-here';

// Helper function for Notion API calls
const callNotionAPI = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// GET /api/items - Fetch all items from Notion database
app.get('/api/items', async (req, res) => {
  try {
    console.log('Fetching items from Notion database...');
    
    const data = await callNotionAPI(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      body: JSON.stringify({
        sorts: [
          {
            timestamp: 'created_time',
            direction: 'descending'
          }
        ]
      })
    });

    // Format the response
    const formattedItems = data.results.map(item => ({
      id: item.id,
      title: item.properties.Name?.title?.[0]?.plain_text || 'Untitled',
      description: item.properties.Description?.rich_text?.[0]?.plain_text || 'No description',
      status: item.properties.Status?.select?.name || 'Not Started',
      created: item.created_time,
      url: item.url
    }));

    console.log(`Successfully fetched ${formattedItems.length} items`);
    res.json({
      success: true,
      data: formattedItems,
      count: formattedItems.length
    });

  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/items - Add new item to Notion database
app.post('/api/items', async (req, res) => {
  try {
    const { title, description, status = 'Not Started' } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Title is required'
      });
    }

    console.log(`Adding new item: "${title}"`);

    const data = await callNotionAPI('https://api.notion.com/v1/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: {
          database_id: DATABASE_ID
        },
        properties: {
          Name: {
            title: [
              {
                text: {
                  content: title.trim()
                }
              }
            ]
          },
          Description: {
            rich_text: [
              {
                text: {
                  content: description?.trim() || ''
                }
              }
            ]
          }
        }
      })
    });

    // Format the response
    const formattedItem = {
      id: data.id,
      title: title.trim(),
      description: description?.trim() || '',
      status: status,
      created: data.created_time,
      url: data.url
    };

    console.log(`Successfully added item with ID: ${data.id}`);
    res.json({
      success: true,
      data: formattedItem
    });

  } catch (error) {
    console.error('Error adding item:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/items/:id - Archive item in Notion
app.delete('/api/items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Archiving item: ${id}`);

    await callNotionAPI(`https://api.notion.com/v1/pages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        archived: true
      })
    });

    console.log(`Successfully archived item: ${id}`);
    res.json({
      success: true,
      message: 'Item archived successfully'
    });

  } catch (error) {
    console.error('Error archiving item:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});
// Optional root route to prevent 404 on /
app.get('/', (req, res) => {
    res.send('✅ Notion Backend is running. Use /api/* routes for data.');
  });
  

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Notion Backend Proxy is running!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Notion Backend Proxy running on http://localhost:${PORT}`);
  console.log(`📋 Database ID: ${DATABASE_ID}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
});