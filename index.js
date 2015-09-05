(function(factory, global){
    if(typeof define === 'function' && define.amd){
        define(factory);
    }
    else if(typeof module === 'object' && typeof exports === 'object'){
        module.exports = factory();
    }
    else{
        global.getMatchedCSSRules = factory();
    }
})((function(win){

    function matchMedia(mediaRule){
        return win.matchMedia(mediaRule.media.mediaText).matches;
    }

    function matchesSelector(el, selector) {
        var matchesSelector = el.matchesSelector || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;

        if (matchesSelector) {
            try {
                return matchesSelector.call(el, selector);
            } catch (e) {
                return false;
            }
        }else{
            var matches = el.ownerDocument.querySelectorAll(selector),
                len = matches.length;

            while(len && len--){
                if(matches[len] === el){
                    return true;
                }
            }
        }
        return false;
    }

    function getMatchedCSSRules(el){
        var matchedRules    = [],
            sheets = el.ownerDocument.styleSheets,
            slen   = sheets.length, rlen, rules, mrules, mrlen, rule, mediaMatched;

        if (el.nodeType === 1) {
            while(slen && slen--){
                rules = sheets[slen].cssRules || sheets[slen].rules;
                rlen  = rules.length;

                while(rlen && rlen--){
                    rule = rules[rlen];
                    if(rule instanceof CSSStyleRule && matchesSelector(el, rule.selectorText)){
                        matchedRules.push(rule);
                    }else if(rule instanceof CSSMediaRule){
                        if(matchMedia(rule)){
                            mrules = rule.cssRules || rule.rules;
                            mrlen  = mrules.length;
                            while(mrlen && mrlen--){
                                rule = mrules[mrlen];
                                if(rule instanceof CSSStyleRule && matchesSelector(el, rule.selectorText)){
                                    matchedRules.push(rule);
                                }
                            }
                        }
                    }
                }
            }
        }

        return matchedRules;
    }

    return function(){
        return win.getMatchedCSSRules ? win.getMatchedCSSRules : getMatchedCSSRules;
    };
})(window), this);