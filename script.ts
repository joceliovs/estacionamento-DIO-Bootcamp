interface veiculo{
    nome: string;
    placa: string;
    entrada: Date | string;
}

(function() {
   const $ = (query: string): HTMLInputElement | null=> document.querySelector(query);

   function calctempo(mil: number){
       
       const min = Math.floor(mil/60000);
       const sec = Math.floor(mil%60000/1000);
       return `${min}m e ${sec}s`;
   }

   function patio(){
       function ler (): veiculo[]{
           return localStorage.patio ? JSON.parse(localStorage.patio): [];
       }
       function salvar(veiculos: veiculo[]){
        localStorage.setItem("patio", JSON.stringify(veiculos));
       }
       function add( veiculo:veiculo , salva?: boolean){
           const row = document.createElement("tr");
           
           row.innerHTML = `
           <td>${veiculo.nome}</td>
           <td>${veiculo.placa}</td>
           <td>${veiculo.entrada}</td>
           <td>
           <button class="delete" data-placa="${veiculo.placa}">X</button>
           </td>
           `;

row.querySelector(".delete")?.addEventListener("click",function(){
    remover(this.dataset.placa);
});

           $("#patio")?.appendChild(row)

           if(salva) salvar([... ler(), veiculo]);
       }
       function remover( placa:string){
           const {entrada, nome} = ler().find(veiculo => veiculo.placa === placa);

          const tempo = calctempo(new Date().getTime() - new Date(entrada).getTime());
          if(!confirm(`o veiculo ${nome} permaneceu por ${tempo}. Deseja Encerrar?`)) return;
          salvar(ler().filter(veiculo => veiculo.placa !== placa));
          render();
       }
       
        function render(){
            $("#patio")!.innerHTML = "";
            const patio= ler();
            if(patio.length){
              patio.forEach(veiculo => add(veiculo));
            
            }
        }
       
        return{ ler,add, remover, salvar, render};
   }

   patio().render();
    
    $ ("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        

        if(!nome || !placa){
           alert("os campos nome e placa são obrigatorios");
           return; 
        }
        patio().add({ nome, placa, entrada: new Date().toISOString() }, true);
    });

})();