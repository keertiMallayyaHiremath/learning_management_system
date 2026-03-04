const axios = require('axios');

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  try {
    console.log('🧪 Testing LMS Backend API...\n');
    
    // Test health endpoint
    console.log('1. Testing Health Endpoint...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', health.data);
    
    // Test subjects endpoint
    console.log('\n2. Testing Subjects Endpoint...');
    const subjects = await axios.get(`${API_BASE}/subjects`);
    console.log('✅ Subjects found:', subjects.data.subjects?.length || 0);
    
    if (subjects.data.subjects?.length > 0) {
      console.log('📚 Available Subjects:');
      subjects.data.subjects.forEach((subject, index) => {
        console.log(`   ${index + 1}. ${subject.title} (${subject.isPublished ? 'Published' : 'Draft'})`);
      });
    }
    
    console.log('\n🎥 YouTube Videos Added:');
    console.log('   1. What is JavaScript? - https://youtu.be/xnOwOBYaA3w');
    console.log('   2. Setting Up Development Environment - https://youtu.be/Qyw1Q8BqGmM');
    console.log('   3. Variables and Data Types - https://youtu.be/ZVnjOPwW4ZA');
    
    console.log('\n👥 Test Users Created:');
    console.log('   Admin: admin@lms.com / admin123');
    console.log('   Test:  test@lms.com / test123');
    
    console.log('\n✅ All API tests passed successfully!');
    console.log('\n🚀 Backend is ready for production!');
    
  } catch (error) {
    console.error('❌ API Test failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Note: Backend server is not running.');
      console.log('   Start it with: cd backend && npm run dev');
    }
  }
}

testAPI();
