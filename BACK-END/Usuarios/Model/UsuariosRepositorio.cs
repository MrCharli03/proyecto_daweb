using Usuarios.Modelo;
using MongoDB.Driver;
using Repositorio;

namespace Usuarios.Repositorio {

     public class RepositorioUsuariosMongoDB : IRepositorioUsuarios<Usuario>
    {
        private readonly IMongoCollection<Usuario> usuarios;

        public RepositorioUsuariosMongoDB() {
            //var database = new MongoClient("mongodb+srv://arso:arso@cluster0.ougkpsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").GetDatabase("arsoNET");
            string connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
            string databaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE");

            var database = new MongoClient(connectionString).GetDatabase(databaseName);

            usuarios = database.GetCollection<Usuario>("usuarios");
        }

        public string Add(Usuario entity)
        {
            usuarios.InsertOne(entity);
            return entity.Id; 
        }

        public void Delete(Usuario entity)
        {
            usuarios.DeleteOne(p => p.Id == entity.Id);
        }

        public List<Usuario> GetAll()
        {
            return usuarios.Find(_ => true).ToList();
        }

        public Usuario GetById(string id)
        {
            return usuarios.Find(p => p.Id == id).FirstOrDefault();
        }

        public List<string> GetIds()
        {
            var todas = usuarios.Find(_ => true).ToList();

            return todas.Select(p => p.Id).ToList();
        }

        public void Update(Usuario entity)
        {
            usuarios.ReplaceOne(p => p.Id == entity.Id, entity);
        }

        public Usuario GetByUsername(string username)
        {
            return usuarios.Find(p => p.Username == username).FirstOrDefault();
        }

        public Usuario GetByDni(string dni)
        {
            return usuarios.Find(p => p.Dni == dni).FirstOrDefault();
        }
    }

}