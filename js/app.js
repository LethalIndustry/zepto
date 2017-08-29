$(document).on('deviceready',function(){
    var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
    if(deviceType=="Android"){
        $(".btnBack").hide();
    }

    $(".ui-page-active").css("min-height","95% !important;");

    $(document).on('focus','input', function() {
      setTimeout(function() {
        $(".footer").hide();
      }, 800);
    });

   $(document).on('blur','input', function() {
      setTimeout(function() {
        $(".footer").show();
      }, 0);
   });

    $.ajax({
      url: "login.html",
      success: function(result) {
          $("#contenido").html(result).trigger("create");
          footer();
      }
    });

    $("#contenido").on("click", ".btnEnviar" ,function(){
        curp = $("#curp").val();
        longitud = curp.length;
        if(curp==""){
            navigator.notification.alert('Debe llenar el campo CURP',alertDismissed,'Error', 'Ok');
            return false;
        }else{
            if(longitud!=1){
                navigator.notification.alert('El campo CURP debe contener 18 caracteres',alertDismissed,'Error', 'Ok');
                return false;
            }else{
                $.ajax({
                  url: "menu.html",
                  success: function(result) {
                        $("#contenido").html(result).trigger("create");
                  }
              });                
            }
        } 
    });

    $("#contenido").on("click", ".calendario" ,function(){
      $.ajax({
          url: "calendario.html", 
          success: function(result) {
                $("#contenido").html(result).trigger("create");
          }
      });
    });

    $("#contenido").on("click", ".avisos" ,function(){
      $.ajax({
          url: "avisos.html", 
          success: function(result) {                
              $("#contenido").html(result).trigger("create");
              $.mobile.loading( 'show', {
                text: 'Por favor espere..',
                textVisible: true,
                theme: 'b'
              });
              $.ajax({
                  url : 'http://cpte.gob.mx/peie/app/data.php',
                  type : 'POST',
                  contentType: "application/json; charset=utf-8",
                  dataType : 'json',
                  success : function(data, textStatus, jqxhr){ 
                  	if(data.length > 0){
	                  	for (var x = 0; x < data.length; x++) {
	                        fecha = data[x].fecha;
	                        aviso = data[x].aviso;
	                        departamento = data[x].departamento;

	                        $(".ui-content").append("<div class='contenedor'><div class='head'>"+fecha+"</div><div class='dentro'>"+aviso+"</div><div class='foo'>"+departamento+"</div>");
	                    }   
	                    $.mobile.loading('hide');	
                  	}else{
                  		navigator.notification.alert('No hay avisos nuevos para mostrar',alertDismissed,'Aviso', 'Ok');
                  		$.ajax({
			                url: "menu.html",
			                success: function(result) {
			                    $("#contenido").html(result).trigger("create");
			                }
			            });
                  	}                               
                  },
                  error : function (jqxhr, textStatus, errorMessage){ 
                      console.log(argument);              
                  }               
              });
          }
          });
    });

    $("#contenido").on("click", ".btnBack" ,function(){
        $.ajax({
            url: "menu.html",
            success: function(result) {
                  $("#contenido").html(result).trigger("create");
            }
        });
    });

    document.addEventListener("backbutton", function(e){
        active = activePage();
        if(active==('index')){
            e.preventDefault(); 
            navigator.notification.confirm(
                "Realmente desea salir de la app?",
                function (button) {
                  if (button==2) {
                    navigator.app.exitApp();
                  }
                },"Pregunta", ["Cancelar","Ok"]
            );
        }
        if(active==('menu')){
            $.ajax({
                url: "login.html",
                success: function(result) {
                    $("#contenido").html(result).trigger("create");
                }
            });
        }
        if(active==('calendario') || active==('avisos')){
            $.ajax({
                url: "menu.html",
                success: function(result) {
                    $("#contenido").html(result).trigger("create");
                }
            });
        }
    }, false);
});

function alertDismissed() {
    // do something
}

function activePage(){
    var active = $("#contenido div[data-role='page']").attr("id");
    return active;
}

function footer(){
    $(".ui-page-active").append("<div data-role='footer' data-position='fixed'><img class='imgBanner' src='img/calificacionesSLP.png'></div>");
}