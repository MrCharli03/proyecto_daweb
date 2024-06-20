using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using Repositorio;
using Usuarios.Modelo;
using Usuarios.Repositorio;
using Usuarios.Servicio;

namespace UsuariosAPI
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSingleton<Repositorio<Usuario, string>, RepositorioUsuariosMongoDB>();

            services.AddSingleton<Repositorio<CodigoActivacion, string>, RepositorioCodigosMongoDB>();

            services.AddSingleton<IServicioUsuarios, ServicioUsuarios>();

            services.AddSingleton<IRepositorioUsuarios<Usuario>, RepositorioUsuariosMongoDB>();

            services.AddControllers(options =>
            {
                options.Filters.Add(typeof(ManejadorGlobalErrores));
            });

            services.AddControllers();

            // Remove or comment out the CORS policy
            // services.AddCors(options =>
            // {
            //     options.AddPolicy("AllowAll", builder =>
            //         builder.AllowAnyOrigin()
            //                .AllowAnyMethod()
            //                .AllowAnyHeader());
            // });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "UsuariosAPI", Version = "v1" });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "UsuariosAPI v1"));
            }

            // Remove or comment out the CORS middleware
            // app.UseCors("AllowAll");

            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }

    public class ManejadorGlobalErrores : ExceptionFilterAttribute
    {
        public override void OnException(ExceptionContext context)
        {
            base.OnException(context);

            if (context.Exception is ArgumentException)
            {
                context.Result = new BadRequestResult();
            }
        }
    }
}
