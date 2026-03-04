const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('Testing LMS Backend API...');
    
    // Test health endpoint
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✓ Health check:', health.data);
    
    // Test subjects endpoint
    const subjects = await axios.get(`${API_BASE}/subjects`);
    console.log('✓ Subjects:', subjects.data.subjects?.length || 0, 'found');
    
    console.log('\n✅ All basic tests passed!');
    console.log('\n📋 Test Users Created:');
    console.log('   Admin: admin@lms.com / admin123');
    console.log('   Test:  test@lms.com / test123');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();
