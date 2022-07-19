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
var Preprocesser = require("./Preprocesser").Preprocesser;
var Summarizer = /** @class */ (function () {
    function Summarizer(string_to_process, number_of_sentences) {
        this.preprocesser = new Preprocesser();
        this.number_of_sentences = number_of_sentences;
        this.string_to_process = string_to_process;
        this.new_length = 0;
    }
    //Takes in a list of sentences and weights and sorts by weight.
    Summarizer.prototype.sortSentences = function (sentence_weights_list) {
        sentence_weights_list.sort(function (a, b) {
            return b[0] - a[0];
        });
        return sentence_weights_list;
    };
    //Converts the textRank map into a list
    Summarizer.prototype.textRankMapToList = function (text_rank_map) {
        var result_list = [];
        text_rank_map.forEach(function (value, key, map) {
            result_list.push([value, key]);
        });
        return result_list;
    };
    //Takes in a list of sorted sentences and a map of those sentences to the original sentences. Returns a string of the entire summary
    Summarizer.prototype.summaryToString = function (sorted_sentences, clean_sentences) {
        var self = this;
        var result_string = "";
        var length_count = 0;
        var count = self.number_of_sentences;
        if (sorted_sentences.length < self.number_of_sentences) {
            count = sorted_sentences.length;
        }
        for (var i = 0; i < count; i++) {
            length_count += sorted_sentences[i][1].split(" ").length;
            result_string += clean_sentences[1].get(sorted_sentences[i][1]);
        }
        this.new_length = length_count;
        return result_string;
    };
    // Takes in a list of sorted sentences and a map of those sentences to the original sentences. Returns an array of summarized sentences.
    Summarizer.prototype.summaryToArray = function (sorted_sentences, clean_sentences) {
        var self = this;
        var result_array = [];
        var length_count = 0;
        var count = self.number_of_sentences;
        if (sorted_sentences.length < self.number_of_sentences) {
            count = sorted_sentences.length;
        }
        for (var i = 0; i < count; i++) {
            length_count += sorted_sentences[i][1].split(" ").length;
            result_array.push(clean_sentences[1].get(sorted_sentences[i][1]));
        }
        this.new_length = length_count;
        return result_array;
    };
    Summarizer.prototype.summarizeByFrequency = function () {
        var self = this;
        var list_to_clean = self.preprocesser.paragraphToSentences(self.string_to_process);
        var clean_sentences = self.preprocesser.cleanSentences(list_to_clean);
        var tokenized = self.preprocesser.tokenizeSentences(clean_sentences[0]);
        var weighted_map = self.preprocesser.getWeights(tokenized);
        var sentence_weights_list = self.preprocesser.sentenceWeights(clean_sentences[0], weighted_map);
        var sorted_sentences = self.sortSentences(sentence_weights_list);
        return {
            summary: self.summaryToString(sorted_sentences, clean_sentences),
            summaryArray: self.summaryToArray(sorted_sentences, clean_sentences),
            sentence_list: list_to_clean,
            weighted_map: weighted_map,
            sorted_sentences: sorted_sentences
        };
    };
    Summarizer.prototype.summarizeByRank = function () {
        return __awaiter(this, void 0, void 0, function () {
            var self, list_to_clean, clean_sentences, nouns_and_adjective_map, text_rank_graph, text_rank_map, text_rank_list, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        list_to_clean = self.preprocesser.paragraphToSentences(self.string_to_process);
                        clean_sentences = self.preprocesser.cleanSentences(list_to_clean);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, self.preprocesser.nounsAndAdjectives(clean_sentences[0])];
                    case 2:
                        nouns_and_adjective_map = _a.sent();
                        text_rank_graph = self.preprocesser.createTextRankGraph(nouns_and_adjective_map);
                        text_rank_map = self.preprocesser.textRank(text_rank_graph);
                        text_rank_list = self.sortSentences(self.textRankMapToList(text_rank_map));
                        return [2 /*return*/, {
                                summary: self.summaryToString(text_rank_list, clean_sentences),
                                summaryArray: self.summaryToArray(text_rank_list, clean_sentences),
                                sentence_list: list_to_clean,
                                nouns_and_adjective_map: nouns_and_adjective_map
                            }];
                    case 3:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Summarizer;
}());
module.exports.Summarizer = Summarizer;
