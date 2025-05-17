// Fonction simple pour tester si la configuration Netlify fonctionne

exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    },
    body: JSON.stringify({ 
      message: "Bonjour ! La fonction Netlify fonctionne correctement !",
      timestamp: new Date().toISOString()
    })
  };
};
