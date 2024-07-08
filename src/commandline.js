import commandLineArgs from 'command-line-args';

export default commandLineArgs([
    {name: 'verbose', alias: 'v', type: Boolean},
    {name: 'force', alias: 'f', type: Boolean},
]);
