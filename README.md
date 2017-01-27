# alexa-skill-supreme-law

My first Alexa skill! 

I recently visited Washington, DC for the first time and seeing the Capitol building and other historic monuments had me feeling politically inspired. So I decided my first Alexa skill should help me relearn the political lessons of old and teach me about the US Constitution.

First, I read a simple tutorial and copied the source code from the following example.

<a href="https://github.com/amzn/alexa-skills-kit-js/tree/master/samples/spaceGeek" target="_blank">https://github.com/amzn/alexa-skills-kit-js/tree/master/samples/spaceGeek</a>

Knowing that I wanted to write a skill focused on the US Constitution, I picked a primary reference for the source text.

<a href="https://www.constituteproject.org/constitution/United_States_of_America_1992" target="_blank">https://www.constituteproject.org/constitution/United_States_of_America_1992</a>

Additionally, I wanted to include short descriptions of the various articles/sections/amendments to succinctly explain each amendment and article.

<a href="https://en.wikipedia.org/wiki/List_of_amendments_to_the_United_States_Constitution" target="_blank">https://en.wikipedia.org/wiki/List_of_amendments_to_the_United_States_Constitution</a>

<h2>Step 1. How Do Alexa Skills Work?</h2>

Reading through the SpageGeek tutorial provided by Amazon was extremely helpful in breaking down all of the steps involved in building and publishing an Alexa Skill. I had only recently started trying out some AWS resources, so this was a great crash course in Lambda functionality. 

<h2>Step 2. What Do I Want My Alexa Skill to Do?</h2>

I really jumped into this with no plan whatsoever. I had a vague idea that I wanted my skill to read parts of the Constitution, but I honestly didn't know much about the structure of the Constitution before I started. So part of this process involved reading the Constitution, familiarizing myself with the structure (Articles/Amendments > Sections > Paragraphs, etc), at least according to the format of the source text I was using. 

(Sidenote, I did find out that the US GPO had released an XML formatted version of the US Constitution to github, but for some reason I decided not to use it and instead built up a JSON version from scratch :/ ...)

<a href="https://github.com/usgpo/house-manual/blob/master/114/original-file-names/constitution.xml" target="_blank">https://github.com/usgpo/house-manual/blob/master/114/original-file-names/constitution.xml</a>

I manually built up a JSON file which organized all of the articles/amendments/sections in the Constitution. This process was somewhat organic, as I refined the structure and naming convention within the JSON file as I developed the interactions and functionality I wanted in the skill. I settled on four high-level goals I wanted to accomplish in terms of learning about the Constitution.

<ul>
<li>Counts - How many articles/sections/amendments are there in the Constitution?</li>
<li>Descriptions - Without reading the full text, what does a specific article/section/amendment actually mean?</li>
<li>Full Text - What's the full text of a specific article/section/amendment?</li>
<li>Dates - When were the different amendments ratified?</li>
</ul>

<h2>Step 3. How Do I Want the Skill to Work?</h2>

The voice interface of an Alexa skill is the structure of how a user can interact with a skill, and defines what inputs variables Alexa should listen for to provide dynamic functionality. 

<a href="https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface" target="_blank">https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/defining-the-voice-interface</a>

The link above is Amazon's definition of the voice interface, what it means and how it works. The voice interface includes two primary components that must be built for any Alexa skill: Utterances and the Intent Schema. Amazon's documentation describes the Intent Schema first, but personally I think that understanding (and building) the Utterance list is the first thing one should do when developing an Alexa skill. It provides the framework for what phrases (and inputs) Alexa should listen for and what do when it hears specific utterances. 

In hindsight, I really wish I had made a functionality map for how I wanted this skill to work. Even though I think the Utterance list is the first place you should start in building a skill, it was a very iterative and organic process to define utterances, group them into intents, and then codify the intents in the Intent Schema. As I thought about how and what people might say to get the information they want (in this case) or make something happen a specific way (in other cases), I found myself regularly adding new utterances, regrouping utterances into intents, adding intents, etc. I wonder if I had made a functionality map, if I could have streamlined this process, or if it's iterative and organic by nature. It's definitely something I will think about more in the future when I make new skills.

See below for the Utterance list for this particular skill...

<h3>Utterances</h3>
<pre>
GetArticles how many articles are there
GetArticles how many articles
GetArticles articles
GetAmendments how many amendments are there
GetAmendments how many amendments
GetAmendments amendments
GetArticleSections how many sections are in article {Article}
GetArticleSections how many sections in article {Article}
GetArticleSections how many sections article {Article}
GetAmendmentSections how many sections are in amendment {Amendment}
GetAmendmentSections how many sections are in the {Amendment} amendment 
GetAmendmentSections how many sections in amendment {Amendment}
GetAmendmentSections how many sections in the {Amendment} amendment 
GetAmendmentSections how many sections amendment {Amendment}
GetAmendmentSections how many sections the {Amendment} amendment 
ReadConstitution read the constitution
ReadConstitution read constitution
ReadPreamble read the preamble
ReadPreamble read preamble
DescribeArticle describe article {Article}
DescribeArticle what's article {Article}
DescribeAmendment describe amendment {Amendment}
DescribeAmendment describe the {Amendment} amendment
DescribeAmendment what's the {Amendment} amendment
ReadArticle read article {Article}
ReadArticle read article {Article} section {Section}
ReadArticle read section {Section} of article {Article}
ReadAmendment read amendment {Amendment}
ReadAmendment read the {Amendment} amendment
ReadAmendment read amendment {Amendment} section {Section}
ReadAmendment read section {Section} of amendment {Amendment}
ReadAmendment read the {Amendment} amendment section {Section}
ReadAmendment read section {Section} of the {Amendment} amendment 
GetAmendmentDate when was amendment {Amendment} 
GetAmendmentDate when was the {Amendment} amendment
GetAmendmentDate when was amendment {Amendment} added
GetAmendmentDate when was the {Amendment} amendment added
GetAmendmentDate when was amendment {Amendment} ratified
GetAmendmentDate when was the {Amendment} amendment ratified
</pre>
