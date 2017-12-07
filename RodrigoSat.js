console.log(solve('fileName.cnf'));//ESCREVA AQUI O NOME DO ARQUIVO
function solve(fileName) {
    let formula =  readFormula(fileName);
    let result = doSolve(formula.clauses, formula.variables, getClause(formula.clauses));
    return result // two fields: isSat and satisfyingAssignment
}
exports.solve = function(fileName) {
    let formula =  readFormula(fileName);
    let result = doSolve(formula.clauses, formula.variables, getClause(formula.clauses));
    return result // two fields: isSat and satisfyingAssignment
}
function readFormula(fileName) {
    var fs = require('fs');
    var text= ""+fs.readFileSync(fileName).toString();
    var separado=text.split("\n");
    let result= { 'clauses': [], 'variables': [] };
    let clauses = readClauses(text);
    let variables=readVariables(clauses);
    let Spec0k= checkProblemSpecification(text, clauses, variables);
    if(Spec0k){
        result.clauses=clauses;
        result.variables=variables;
    }
    return result;
}
function checkProblemSpecification(text, clauses, variables) {
    var qtclausulas;
    var qtvariaveis;
    var separado=[];
    var separado=text.split("\n");
    for(var a=0; a<separado.length; a++){
       if(separado[a]!=null && separado[a].charAt(0)=='p') {
            var linha = separado[a].split(' ');
            qtclausulas = linha[3];
            qtvariaveis = linha[2];
       }}
        if(clauses.length==qtclausulas&&variables.length==qtvariaveis){
        return true;
        }else{
        return false;
        }
}
function doSolve(clauses, variables, codigo) {
    var resp={};
    var casox=validCode(codigo, variables);
    if((casox)){
        if(ultimaTentativa(variables)){
            resp= { 'isSat': false, 'satisfyingAssignment': null };
            return resp;

        }else{
            var atribuicoes=[];
            var indices=codeToIndex(casox, variables);
            for(var a=0; a<indices.length; a++){
                atribuicoes.push(variables[indices[a]]);
            }
            var x=true;
            while(x&&!ultimaTentativa(variables)){
                variables=nextAssignment(variables);
                for(var b=0; b<atribuicoes.length; b++){
                    if(atribuicoes[b]!=variables[indices[b]]){
                        x=false;
                        b=1000000;
                    }
                    }
            }
           return doSolve(clauses,variables, codigo);
        }}else{
        resp= { 'isSat': true, 'satisfyingAssignment': variables };
        return resp;
    }
}

function ultimaTentativa(variables) {
    for(var x=0; x<variables.length; x++ ){
        if(variables[x]==0){
            return false;
        }
    }
    return true;
}
function nextAssignment(currentAssignment) {
    var b=true;
    var valor=currentAssignment.length-1;
    while(b){
        if(currentAssignment[valor]==0) {
            currentAssignment[valor] = 1;
            b=false;
        }else{
            currentAssignment[valor]=0;
            valor=valor-1;
        }
        }
        return currentAssignment;


}
function codeToIndex(codigo, variaveis) {
    var indices=[];
    var code= codigo;
    for(var x=0; x<variaveis.length; x++){
        if(code.indexOf(x)!=-1){
            indices.push(x);
        }
    }
    return indices;
}

function readClauses(text) {
    var semlinhas = [];
    var clauses = [];
    var separado = text.split("\n");
    var linhasclausulas = [];

    for (var a = 0; a < separado.length; a++) {
        if (separado[a] != null && separado[a].charAt(0) == 'c') {
            separado[a] = "";
        } else if (separado[a] != null && separado[a].charAt(0) == 'p') {
            separado[a] = '';
        } else {
            linhasclausulas.push(separado[a]);
        }
    }
    for (var b = 0; b < linhasclausulas.length; b++) {
        var cadalinha = linhasclausulas[b].split(' ');
        for (var c = 0; c < cadalinha.length; c++) {
            if (cadalinha[c]!=undefined) {
                semlinhas.push(cadalinha[c]);
            }


        }
        }
    var subClauses = [];
    for (var a = 0; a < semlinhas.length; a++) {
        if (semlinhas[a] == 0 && semlinhas[a][0]!=undefined) {
            clauses.push(subClauses);
            subClauses = [];
        } else if(semlinhas[a][0]!=undefined) {
            subClauses.push(semlinhas[a]);
        }
    }
    return clauses;
}
function readVariables(clauses) {
    var variables=[];
    var retvariables=[];
    for(var a=0; a<clauses.length; a++){
        for(var b=0; b<clauses[a].length; b++){
            if(elementoJaPresente(variables, clauses[a][b])){
                variables.push(clauses[a][b]);
            }
        }}
    for(var a=0; a<variables.length; a++){
       retvariables.push(0);
    }
    return retvariables;

}
function elementoJaPresente(variables, item) {
    for(var a=0; a<variables.length; a++){
        if(variables[a]==item||variables[a]==-item){
            return false;
        }
    }
    return true;
}
function getClause(clauses) {
    var codigo="(";
    var codigogeral=[];
    for(var d=0; d<clauses.length; d++){
        for(var e=0; e<clauses[d].length; e++){
            if(e==clauses[d].length-1){
                if(clauses[d][e].toString().indexOf("-")!=-1){
                    clauses[d][e]= clauses[d][e].replace('-', '');
                    clauses[d][e]=parseInt(clauses[d][e]);
                    codigo=codigo+'(!Boolean(variables['+((clauses[d][e])-1)+'])))';
                }else{
                    clauses[d][e]=parseInt(clauses[d][e]);
                    codigo=codigo+'(Boolean(variables['+((clauses[d][e])-1)+'])))';
                }
            }else if(clauses[d][e].toString().indexOf("-")!=-1){
                clauses[d][e]=clauses[d][e].replace('-', '');
                clauses[d][e]=parseInt(clauses[d][e]);
                codigo=codigo+'(!Boolean(variables['+((clauses[d][e])-1)+']))||';
            }else{
                clauses[d][e]=parseInt(clauses[d][e]);
                codigo=codigo+'(Boolean(variables['+((clauses[d][e])-1)+']))||';
            }
        }

            codigogeral.push(codigo);
            codigo='(';

    }

    return codigogeral;
}
function validCode(codigo, variables) {
    for(var x=0; x<codigo.length; x++){
        if(!eval(codigo[x])){
            return codigo[x];
        }
    }
    return false;
}