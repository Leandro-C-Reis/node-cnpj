const Horseman = require('node-horseman');
const jsdom = require('jsdom');
const { number } = require('assert-plus');

const { JSDOM } = jsdom;

async function GetCNPJInfo(cnpj) {
    if (typeof(cnpj) != String || cnpj.length != 14 || parseInt(cnpj) == NaN)
    {
        return {};
    }

    const horseman = new Horseman();
    var obj = {};
    
    await horseman.on('Console Message', console.log)
        .open(`https://cnpjs.rocks/cnpj/${cnpj}`)
        .html('.dados')
        .then(html => {
            const dom = new JSDOM(`${html}`);
            const Uls = dom.window.document.querySelectorAll('ul');
        
            Uls.forEach(ul => {
                for (let i = 0; i < ul.children.length; i++)
                {
                    const separator = ul.children[i].textContent.split(':  ');
                    if (obj.hasOwnProperty(separator[0]))
                    {
                        const aux = obj[separator[0]];
                        if (typeof (obj[separator[0]]) != 'object')
                        {
                            obj[separator[0]] = [];
                            obj[separator[0]].push(aux);
                        }
                        obj[separator[0]].push(separator[1]);
                    }
                    else if (separator[0] != 'Rolar para Cima') obj[separator[0]] = separator[1];
                }
            })
            return horseman.close();
        });

    return obj;
}

module.exports = GetCNPJInfo;