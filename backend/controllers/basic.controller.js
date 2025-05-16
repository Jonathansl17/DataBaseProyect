
const helloWorldController = (req, res) => {
  res.json({mensaje:"Hola mundo desde un controlador, este mensaje viene de una api"});
};

export default helloWorldController