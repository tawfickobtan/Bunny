import path from 'path';

export function isInsideCwd(cwd: string, resPath: string): boolean{
    const resPathArr = resPath.split(path.sep);
    const resCwd = path.resolve(cwd);
    const resCwdArr = resCwd.split(path.sep);
    if (resPathArr.length < resCwdArr.length)
        return false;
    var i = 0;
    while (i < resCwdArr.length){
        if (resCwdArr[i] !== resPathArr[i])
            return false;
        i++;
    }   
    return true;
}