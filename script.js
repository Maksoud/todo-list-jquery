let GLOBAL = {};

const txtb        = null;
const pendente    = null;
const concluido   = null;
const delTask     = null;
const endTask     = null;

$(document).ready(function() {
    
    GLOBAL.txtb      = $("<input>").attr("type", "text").attr("placeholder", "Descreva a tarefa...").addClass("txtb");
    GLOBAL.pendente  = $("<div>").addClass("notcomp");
    GLOBAL.concluido = $("<div>").addClass("comp");
    
    //******************//
    
    $("body").html("").append(
        $(GLOBAL.txtb).keyup( (e) => {
            addTask(e);
        }),
        $(GLOBAL.pendente).append(
            $("<h3>").text("Tarefas Pendentes")
        ),
        $(GLOBAL.concluido).append(
            $("<h3>").text("Tarefas Concluídas")
        )
    );
    
});

//******************//

function addTask (event) {
    
    //13  means enter button
    if (event.which == 13 && $(event.target).val() != "") {
        
        const newTask  = $("<div>").addClass("task");
        
        //******************//
        
        GLOBAL.endTask = $("<i class='endTask fas fa-check'></i>").click( (e) => {
                    
            // This task
            let This = $(e.target).parent();
            
            This.fadeOut( () => {
                
                // Add delete event on concluded task
                This.find(".delTask").click( (el) => {
                        
                    let delThis = $(el.target).parent();
                
                    delThis.fadeOut( () => {
                    
                        delThis.remove();
                    
                    });
                    
                });
                
                // Remove endTask button
                This.find(".endTask").remove();
                
                // Insert content in completed tasks
                $(GLOBAL.concluido).append(
                    This
                );
                
                // Fade it
                This.fadeIn();
                
            });
            
            // Remove task from pending list
            This.remove();
            
        });
        
        //******************//
        
        GLOBAL.delTask = $("<i class='delTask fas fa-trash-alt'></i>").click( (e) => {
                        
            let This = $(e.target).parent();
        
            This.fadeOut( () => {
            
                This.remove();
            
            });
            
        });
        
        //******************//
        
        // Create task element
        $(newTask).append(
            $(GLOBAL.txtb).val(), 
            $(GLOBAL.endTask),
            $(GLOBAL.delTask)
        );
        
        //******************//
        
        // Add element to Pending tasks
        $(GLOBAL.pendente).append(
            $(newTask)
        );
        
        //******************//
      
        // Clean it up
        $(GLOBAL.txtb).val("");
      
    }// if (event.which == 13 && $(event.target).val() != "")
    
}// function addTask (event)

