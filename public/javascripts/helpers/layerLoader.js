/**
 * @author rrubalcava@odoe.net (Rene Rubalcava)
 */
/*global window document console define require esri*/
// TODO - add loaders for other maptypes
(function() {
    'use strict';

    define([
        './symbolHelper',
        'esri/layers/FeatureLayer'
        ], function(symbols, FeatureLayer) {

            var dynamicLoader,
                featureLoader,
                LayerLoader;

            /**
            * Private function to create a Dynamic Layer from config file
            * @param {Object} Layer options from config
            * @return {ArcGISDynamicMapServiceLayer} Dynamic Map Service Layer for map
            */
            dynamicLoader = function(lyr) {

                var _dlyr = new esri.layers.ArcGISDynamicMapServiceLayer(lyr.url, {
                    id: lyr.id
                });
                _dlyr.title = lyr.title;
                _dlyr.visible = lyr.visible;
                _dlyr.setVisibleLayers(lyr.visibleLayers);
                if (lyr.opacity) _dlyr.setOpacity(lyr.opacity);
                if (lyr.operational) this.operational[this.operational.length] = _dlyr;
                if (lyr.identifyCapability.canIdentify) {
                    _dlyr.canIdentify = lyr.identifyCapability.canIdentify;
                    _dlyr.identifyLayers = lyr.identifyCapability.identifyLayers;
                }

                return _dlyr;

            };

            /**
            * Private function to create a FeatureLayer from config file
            * @param {Object} Layer options from config
            * @return {FeatureLayer} Feature Layer for map
            */
            featureLoader = function(lyr) {

                var _flyr = new FeatureLayer(lyr.url, {
                    id: lyr.id,
                    mode: lyr.mode,
                    outFields: lyr.outFields
                });
                if (lyr.useRenderer) {
                    if (lyr.rendererType.toLowerCase() === 'polygon') {
                        var sym = symbols.polygonSymbol();
                        _flyr.setRenderer(new esri.renderer.SimpleRenderer(sym));
                    } else if (lyr.rendererType.toLowerCase() === 'line') {
                        var lin = symbols.selectedLineSymbol();
                        _flyr.setRenderer(new esri.renderer.SimpleRenderer(lin));
                    }
                }

                return _flyr;

            };

            /**
             * Constructor for a layer helper
             * @return {LayerLoader} this
             */
            LayerLoader = function () {

                this.operational = [];
                this.layersToAdd = [];

                return this;

            };

            /**
             * The purpose of this function is to parse config layers to map layers
             * @param {Array} layers
             * @return {Return_type} comment
             */
            LayerLoader.prototype.loadLayers = function (layers) {

                for (var i = 0, len = layers.length; i < len; i++) {
                    var lyr = layers[i];
                    if (lyr.type.toLowerCase() === 'dynamic') { // load the dynamic layers defined in config
                        this.layersToAdd[this.layersToAdd.length] = dynamicLoader.call(this, lyr);
                    } else if (lyr.type.toLowerCase() === 'feature') { // load the feature layers defined in config
                        this.layersToAdd[this.layersToAdd.length] = featureLoader.call(this, lyr);
                    }
                }

                return this;

            };

            return LayerLoader;

        });

}).call(this);
