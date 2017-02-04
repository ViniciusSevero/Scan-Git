var cron = require('cron');
var exec = require('exec');

//diretorio raiz dos repositórios
var rootDir = '';

if(process.argv < 3){
    rootDir = 'Workspace';
}else{
    rootDir = process.argv[2];
}

var updateRepositories = function(repository){
    var cmd = 'cd ~/'+rootDir+'/'+repository+'/;git pull';
        exec(cmd,function(err,out,code){
        if(out.trim() != ''){
            console.log('Atualizando repositório '+repository);
            console.log(out);
            exec('notify-send "'+repository+'" "'+out+'"',function(err,out,code){if(err) throw err});
        }
    });
};

var scanFolders = function(err,out,code){
    if(err) throw err;
    var array = out.split('\n');
    for(key in array){
        if(array[key] != ''){
            updateRepositories(array[key]);
        }
    };
};

var job = new cron.CronJob('*/30 * * * * *',function(){
    var cmd = 'cd ~/'+rootDir+'/;ls';
    exec(cmd,scanFolders);
}).start();