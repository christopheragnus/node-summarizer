"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var WordPos = require("wordpos");
var WeightedGraph = require("./WeightedGraph").WeightedGraph;
var sbd = require("sbd");
var Preprocesser = /** @class */ (function () {
    function Preprocesser() {
        this.tokenizer = sbd;
    }
    //This method takes in a paragraph and returns a list of the sentences in the paragraph.
    Preprocesser.prototype.paragraphToSentences = function (string_to_process) {
        try {
            var result = this.tokenizer.sentences(string_to_process, {});
            return result;
        }
        catch (err) {
            return Error("Cannot toeknize the given string.");
        }
    };
    //Cleans the sentences by removing punctuation and lowercasing capital letters.
    Preprocesser.prototype.cleanSentences = function (list_to_clean) {
        var sentence_map = new Map();
        var regex = /[&\/\\#,+()$~%.'":*?<>{}]/g;
        for (var i = 0; i < list_to_clean.length; i++) {
            var original_sentence = list_to_clean[i];
            list_to_clean[i] = list_to_clean[i].toLowerCase();
            list_to_clean[i] = list_to_clean[i].replace(regex, "");
            sentence_map.set(list_to_clean[i], original_sentence);
        }
        return [list_to_clean, sentence_map];
    };
    //Takes in a list of sentences and returns a list of all of the words in the sentences.
    Preprocesser.prototype.tokenizeSentences = function (list_of_sentences) {
        var new_array = new Array();
        new_array = list_of_sentences;
        var result_list = [];
        for (var i = 0; i < new_array.length; i++) {
            result_list = result_list.concat(new_array[i].split(" "));
        }
        return result_list;
    };
    //Takes in a list of words and calculates the frequencies of the words.
    //Returns a list. The first item is a map of word->frequency. The second is the max frequency.
    Preprocesser.prototype.getFrequencyAndMax = function (list_of_words) {
        var frequency_map = new Map();
        var max = 0;
        for (var i = 0; i < list_of_words.length; i++) {
            var word = list_of_words[i];
            if (frequency_map.has(word)) {
                var new_val = frequency_map.get(word) + 1;
                frequency_map.set(word, new_val);
                if (new_val > max) {
                    max = new_val;
                }
            }
            else {
                frequency_map.set(word, 1);
            }
        }
        return [frequency_map, max];
    };
    //Converts a frequency map into a map with "weights".
    Preprocesser.prototype.getWeights = function (list_of_words) {
        var frequencies_and_max = this.getFrequencyAndMax(list_of_words);
        var frequencies_map = frequencies_and_max[0];
        var max = frequencies_and_max[1];
        frequencies_map.forEach(function (value, key, map) {
            map.set(key, value / max);
        });
        return frequencies_map;
    };
    Preprocesser.prototype.sentenceWeights = function (clean_sentences, weighted_map) {
        var weight_of_sentence = 0;
        var sentence_weight_list = [];
        var sentence = "";
        for (var i = 0; i < clean_sentences.length; i++) {
            sentence = clean_sentences[i];
            var word_list = sentence.split(" ");
            weight_of_sentence = 0;
            for (var j = 0; j < word_list.length; j++) {
                weight_of_sentence += weighted_map.get(word_list[j]);
            }
            sentence_weight_list.push([
                weight_of_sentence / word_list.length,
                sentence,
            ]);
        }
        return sentence_weight_list;
    };
    //Takes a list of sentences and returns a map of the each sentence to its nouns and adjectives
    Preprocesser.prototype.nounsAndAdjectives = function (clean_sentences) {
        return __awaiter(this, void 0, void 0, function () {
            var nouns_and_adjectives_map, wordpos, i, adjectives, nouns, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        nouns_and_adjectives_map = new Map();
                        wordpos = new WordPos();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < clean_sentences.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, wordpos.getAdjectives(clean_sentences[i])];
                    case 3:
                        adjectives = _a.sent();
                        return [4 /*yield*/, wordpos.getNouns(clean_sentences[i])];
                    case 4:
                        nouns = _a.sent();
                        nouns_and_adjectives_map.set(clean_sentences[i], nouns.concat(adjectives));
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 2];
                    case 6: return [4 /*yield*/, nouns_and_adjectives_map];
                    case 7: return [2 /*return*/, _a.sent()];
                    case 8:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [2 /*return*/];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    //Used for the text rank summary. Takes two lists of words and gets the weight of the edge connecting the vertices.
    Preprocesser.prototype.getEdgeWeights = function (list1, list2) {
        var weight = 0;
        var intial = list1;
        var other = list2;
        if (list2.length >= list1.length) {
            intial = list2;
            other = list1;
        }
        for (var i = 0; i < intial.length; i++) {
            if (other.includes(intial[i])) {
                weight += 1;
            }
        }
        return weight;
    };
    //Creates the graph for the textrank algorithm.
    Preprocesser.prototype.createTextRankGraph = function (nouns_and_adjactive_map) {
        var graph = new WeightedGraph();
        var key_list = [];
        var weight = 0;
        nouns_and_adjactive_map.forEach(function (value, key, map) {
            key_list.push(key);
        });
        for (var i = 0; i < key_list.length; i++) {
            for (var j = i + 1; j < key_list.length; j++) {
                weight = this.getEdgeWeights(nouns_and_adjactive_map.get(key_list[i]), nouns_and_adjactive_map.get(key_list[j]));
                if (weight > 0) {
                    graph.addEdge(key_list[i], key_list[j], weight);
                }
            }
        }
        return graph;
    };
    //TextRank algorithm.
    Preprocesser.prototype.textRank = function (graph) {
        var key_list = graph.getAllVertices();
        var text_rank_map = new Map();
        //random key to start with
        if (key_list.length == 0) {
            return text_rank_map;
        }
        var key = key_list[Math.floor(Math.random() * key_list.length)];
        var vertex = graph.getVertex(key);
        var probability_list = [];
        var _loop_1 = function (i) {
            var full_weight = 0;
            vertex.adjacent.forEach(function (value, key, map) {
                full_weight += value;
            });
            vertex.adjacent.forEach(function (value, key, map) {
                for (var x = 0; x < value; x++) {
                    probability_list.push(key);
                }
            });
            var sentence = probability_list[Math.floor(Math.random() * probability_list.length)];
            if (text_rank_map.has(sentence)) {
                text_rank_map.set(sentence, text_rank_map.get(sentence) + 1);
            }
            else {
                text_rank_map.set(sentence, 1);
            }
            var last_vertex = vertex;
            vertex = graph.getVertex(sentence);
            probability_list = [];
        };
        //random walk
        for (var i = 0; i < 10000; i++) {
            _loop_1(i);
        }
        return text_rank_map;
    };
    return Preprocesser;
}());
module.exports.Preprocesser = Preprocesser;
