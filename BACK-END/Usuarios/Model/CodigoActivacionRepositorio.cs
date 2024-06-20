using Usuarios.Modelo;
using MongoDB.Driver;
using Repositorio;

namespace Usuarios.Repositorio {

     public class RepositorioCodigosMongoDB : Repositorio<CodigoActivacion, string>
    {
        private readonly IMongoCollection<CodigoActivacion> codigos;

        public RepositorioCodigosMongoDB() {
            //var database = new MongoClient("mongodb+srv://arso:arso@cluster0.ougkpsu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").GetDatabase("arsoNET");

            string connectionString = Environment.GetEnvironmentVariable("MONGODB_URI");
            string databaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE");

            var database = new MongoClient(connectionString).GetDatabase(databaseName);

            codigos = database.GetCollection<CodigoActivacion>("codigos");
        }

        public string Add(CodigoActivacion entity)
        {
            codigos.InsertOne(entity);
            return entity.Id; 
        }

        public void Delete(CodigoActivacion entity)
        {
            codigos.DeleteOne(p => p.Id == entity.Id);
        }

        public List<CodigoActivacion> GetAll()
        {
            return codigos.Find(_ => true).ToList();
        }

        public Usuario GetByEmail(string email)
        {
            throw new NotImplementedException();
        }

        public CodigoActivacion GetById(string id)
        {
            return codigos.Find(p => p.Id == id).FirstOrDefault();
        }

        public List<string> GetIds()
        {
            var todas = codigos.Find(_ => true).ToList();

            return todas.Select(p => p.Id).ToList();
        }

        public void Update(CodigoActivacion entity)
        {
            codigos.ReplaceOne(p => p.Id == entity.Id, entity);
        }
    }

}