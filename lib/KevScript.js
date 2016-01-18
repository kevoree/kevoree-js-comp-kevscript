var AbstractComponent = require('kevoree-entities').AbstractComponent;
var kevoree = require('kevoree-library').org.kevoree;
var KevScript = require('kevoree-kevscript');

/**
 * Kevoree component
 * @type {KevScript}
 */
var KevScriptComp = AbstractComponent.extend({
    toString: 'KevScript',

    construct: function() {
        this.kevs = new KevScript();
    },
            
    /* This is an example of dictionary attribute that you can set for your entity */
    dic_kevScript: {
        optional: false,
        datatype: 'STRING'
    },

    in_trigger: function (msg) {
        var factory = new kevoree.factory.DefaultKevoreeFactory();
        var cloner = factory.createModelCloner();
        var modelToApply = cloner.clone(this.getKevoreeCore().getCurrentModel());
        var ks = this.getDictionary().getString('kevScript', '');
        var ksToApply = ks.replace(/\{([^}]+)\}/g, '%%$1%%');
        this.kevs.parse(ksToApply, modelToApply, function(err, model) {
            if(err) {
                this.log.error(this.toString(), 'Unable to parse KevScript ('+err.message+').');

            } else {
                this.getKevoreeCore().deploy(model, function() {
                    this.log.info("Model deployed");
                }.bind(this));
            }
        }.bind(this));
    }
});

module.exports = KevScriptComp;
