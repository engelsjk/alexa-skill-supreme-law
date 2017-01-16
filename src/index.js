'use strict';
var Alexa = require('alexa-sdk');
var APP_ID = 'amzn1.ask.skill.53d2b3a3-37b9-4cea-bde6-5238ea61d991';  

// US CONSTITUTION
var t_us_constitution = require("./us-constitution.json");

//

var languageStrings = {
    "en-US": {
        "translation": {
            "CONSTITUTION": t_us_constitution,
            "SKILL_NAME" : "US Constituion",
            "GET_FACT_MESSAGE" : "",
            "HELP_MESSAGE" : "You can ask me to read a specific part of the US Constitution, specifically Articles and Amendments and their different sections.",
            "HELP_REPROMPT" : "What part of the US Constitution would you like to hear?",
            "STOP_MESSAGE" : "Goodbye!"
        }
    }
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function readParagraphs(text, output){
    var paragraphs = Object.keys(text);
    for(var jj=0; jj<paragraphs.length; jj++){
        var paragraph_idx = paragraphs[jj];
        var paragraph_text = text[paragraph_idx];
        output += 'Paragraph ' + (jj+1) + '. ';
        output += paragraph_text + ' ';
    }
    return output;
}

function processNumber(number_i) {

    var number_int = -1;
    number_int = parseInt(number_i);

    if(isNaN(number_int)){

        var number_conversion = {
            'first': 1,
            'second': 2,
            'third': 3,
            'fourth': 4,
            'fifth': 5,
            'sixth': 6,
            'seventh': 7,
            'eight': 8,
            'ninth': 9,
            'tenth': 10,
            'eleventh': 11,
            'twelfth': 12,
            'thirteenth': 13,
            'fourteenth': 14,
            'fifteenth': 15,
            'sixteenth': 16,
            'seventeenth': 17,
            'eighteenth': 18,
            'nineteenth': 19,
            'twentieth': 20,
            'twenty-first': 21, 
            'twenty-second': 22,
            'twenty-third': 23,
            'twenty-fourth': 24,
            'twenty-fifth': 25,
            'twenty-sixth': 26,
            'twenty-seventh': 27,
            '1st': 1,
            '2nd': 2,
            '3rd': 3,
            '4th': 4,
            '5th': 5,
            '6th': 6,
            '7th': 7,
            '8th': 8,
            '9th': 9,
            '10th': 10,
            '11th': 11,
            '12th': 12,
            '13th': 13,
            '14th': 14,
            '15th': 15,
            '16th': 16,
            '17th': 17,
            '18th': 18,
            '19th': 19,
            '20th': 20,
            '21st': 21,
            '22nd': 22,
            '23rd': 23,
            '24th': 24,
            '25th': 25,
            '26th': 26,
            '27th': 27
        };

        number_int = number_conversion[number_i];

    }

    if(number_int === undefined){
        number_int = -1;
    }

    return number_int;
}

function readArticleOrAmendment(article_amendment, constitution, body_i, section_i) {

    if(article_amendment === 'ARTICLE'){
        var aa_type = 'ARTICLE';
        var aa_index = 'ARTICLE-';
        var aa_num = 'NUM_ARTICLES';
    }else if(article_amendment === 'AMENDMENT'){
        var aa_type = 'AMENDMENT';
        var aa_index = 'AMENDMENT-';
        var aa_num = 'NUM_AMENDMENTS';
    }

    var output = '';
    var body_int = processNumber(body_i);
    var section_int = -1;
    (section_i != undefined) ? section_int = processNumber(section_i) : section_int = -2;

    if(body_int === -1){
        output += "I'm not sure which " + aa_type + " you're looking for, please pick a different number.";
        return output;
    }
    if(section_int === -1){
        output += "I'm not sure which section you're looking for in " + aa_type + " " + body_int + ", please pick a different number.";
        return output;
    }

    var body_idx = aa_index + body_int;
    var num_body = constitution[aa_num];

    if(body_int > num_body){
        output += 'There are only ' + num_body + ' ' + aa_type + 's in the US Constitution.'
        return output;
    }else{

        var body_o = constitution[aa_type + 'S'][body_idx];
        var num_sections = body_o['NUM_SECTIONS'];

        if(section_int > 0){
            if(num_sections === 0){
                output += body_o['NAME'] + ' does not have any sections.';
                return output;
            }
            if(section_int > num_sections){
                output += 'There are only ' + num_sections + ' sections in ' + body_o['NAME'];
                return output;
            }
        }

        if(section_int === -2){
             output += body_o['NAME'] + '. ';
            if(num_sections===0){
                var text = body_o['TEXT'];
                output = readParagraphs(text, output);
            }else{
                var sections = Object.keys(body_o['TEXT']);
                for(var ii=0; ii<sections.length; ii++){
                    var section_idx = sections[ii];
                    var section = body_o['TEXT'][section_idx];
                    output += section['NAME'] + '. ';
                    var text = section['TEXT'];
                    output = readParagraphs(text, output);
                }
            }
            return output;
        }else{
            output += body_o['NAME'] + '. ';
            var section_idx = 'SECTION-' + section_int;
            var section = body_o['TEXT'][section_idx];
            output += section['NAME'] + '. ';
            var text = section['TEXT'];
            output = readParagraphs(text, output);
            return output;
        }
    }
}

function getArticleSections(constitution, article_i){
    
    var article_int = processNumber(article_i);
    var num_articles = constitution['ARTICLES'].length;

    if(article_int === -1){
        var speechOutput = "I'm sorry, please try another article.";
    }else{
        if(article_int > num_articles){
            var speechOutput = 'There are only ' + num_articles + ' Articles in the US Constitution.'
        }else{
            var article_idx = 'AMENDMENT-' + article_int;
            var article_o = constitution['ARTICLES'][article_idx];
            var num_sections = article_o['NUM_SECTIONS'];
            if(num_sections===0){
                var num_paragraphs = Object.keys(article_o['TEXT']).length;
                var s_paragraph = '';
                num_paragraphs > 1 ? s_paragraph = 'paragraphs' : s_paragraph = 'paragraph';
                var speechOutput = 'There are no sections in  ' + article_o['NAME'] + ', only ' + num_paragraphs + ' ' + s_paragraph;
            }else{
                var speechOutput = 'There are ' + num_sections + ' sections in ' + article_o['NAME'] + '.';
            }  
        } 
    }
    return speechOutput;
}

function getAmendmentSections(constitution, amendment_i){

    var amendment_int = processNumber(amendment_i);
    var num_amendments = constitution['AMENDMENTS'].length;

    if(amendment_int === -1){
        var speechOutput = "I'm sorry, please try another amendment.";
    }else{
        if(amendment_int > num_amendments){
            var speechOutput = 'There are only ' + num_amendments + ' Amendments in the US Constitution.'
        }else{
            var amendment_idx = 'AMENDMENT-' + amendment_int;
            var amendment_o = constitution['AMENDMENTS'][amendment_idx];
            var num_sections = amendment_o['NUM_SECTIONS'];
            if(num_sections===0){
                var num_paragraphs = Object.keys(amendment_o['TEXT']).length;
                var s_paragraph = '';
                num_paragraphs > 1 ? s_paragraph = 'paragraphs' : s_paragraph = 'paragraph';
                var speechOutput = 'There are no sections in ' + amendment_o['NAME'] + ', only ' + num_paragraphs + ' ' + s_paragraph;
            }else{
                var speechOutput = 'There are ' + num_sections + ' sections in ' + amendment_o['NAME'] + '.';
            }
        }
    }
    return speechOutput;
}

var handlers = {
    'LaunchRequest': function () {
        this.emit('Welcome');
    },
    'Welcome': function() {
        var speechOutput = "Welcome! I'll be reading the " + this.t('CONSTITUTION')['NAME'] + ".";
        this.emit(':tell', speechOutput);
    },
    'GetArticles': function () {
        var num_articles = this.t('CONSTITUTION')['NUM_ARTICLES'];
        var speechOutput = 'There are ' + num_articles + ' articles in the US Constitution.';
        this.emit(':tell', speechOutput);
    },
    'GetAmendments': function () {
        var num_amendments = this.t('CONSTITUTION')['NUM_AMENDMENTS'];
        var speechOutput = 'There are ' + num_amendments + ' amendments in the US Constitution.';
        this.emit(':tell', speechOutput);
    },
    'GetArticleSections': function () {
        var article_i = this.event.request.intent.slots.Article.value;
        var constitution = this.t('CONSTITUTION');
        var speechOutput = getArticleSections(constitution, article_i);
        this.emit(':tell', speechOutput);
    },
    'GetAmendmentSections': function () {
        var amendment_i = this.event.request.intent.slots.Amendment.value;
        var constitution = this.t('CONSTITUTION');
        var speechOutput = getAmendmentSections(constitution, amendment_i);
        this.emit(':tell', speechOutput);
    },
    'ReadConstitution': function () {
        var speechOutput = "That's a lot of constitution...";
        this.emit(':tell', speechOutput);
    },
    'ReadPreamble': function () {
        var speechOutput = this.t('CONSTITUTION')['PREAMBLE']['TEXT'];
        this.emit(':tell', speechOutput);
    },
    'DescribeArticle': function () {
        var article = this.event.request.intent.slots.Article.value;
        var article_idx = 'ARTICLE-' + article;
        var article_o = this.t('CONSTITUTION')['ARTICLES'][article_idx];
        var speechOutput = article_o['DESCRIPTION'];
        this.emit(':tell', speechOutput);
    },
    'DescribeAmendment': function () {
        var amendment = this.event.request.intent.slots.Amendment.value;
        var amendment_int = processNumber(amendment);
        if(amendment_int === -1){
            var speechOutput = "I'm sorry, please try another amendment.";
        }else{
            var amendment_idx = 'AMENDMENT-' + amendment_int;
            var amendment_o = this.t('CONSTITUTION')['AMENDMENTS'][amendment_idx];
            var speechOutput = amendment_o['NAME'] + ' ' + amendment_o['DESCRIPTION'];
        }
        this.emit(':tell', speechOutput);
    },
    'ReadArticle': function () {

        var article = this.event.request.intent.slots.Article.value;
        var section = this.event.request.intent.slots.Section.value;
        var constitution = this.t('CONSTITUTION');

        var output = readArticleOrAmendment('ARTICLE', constitution, article, section);
        var speechOutput = output;
        this.emit(':tell', speechOutput);

    },
    'ReadAmendment': function () {

        var amendment = this.event.request.intent.slots.Amendment.value;
        var section = this.event.request.intent.slots.Section.value;
        var constitution = this.t('CONSTITUTION');

        var output = readArticleOrAmendment('AMENDMENT', constitution, amendment, section);
        var speechOutput = output;
        this.emit(':tell', speechOutput);

    },
    'GetAmendmentDate': function () {
        var amendment = this.event.request.intent.slots.Amendment.value;
        var amendment_int = processNumber(amendment);
        if(amendment_int === -1){
            var speechOutput = "I'm sorry, please try another amendment.";
        }else{
            var amendment_idx = 'AMENDMENT-' + amendment_int;
            var amendment_o = this.t('CONSTITUTION')['AMENDMENTS'][amendment_idx];
            var speechOutput = amendment_o['NAME'] + ' was ratified on ' + amendment_o['DATE_RATIFIED'];
        }
        this.emit(':tell', speechOutput);
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};