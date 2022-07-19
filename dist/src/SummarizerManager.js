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
var Summarizer = require("./Summarizer").Summarizer;
var natural = require("natural");
var SummarizerManager = /** @class */ (function () {
    function SummarizerManager(string, number_of_sentences) {
        this.string = string;
        this.number_of_sentences = number_of_sentences;
        this.rank_summary = "";
        this.frequency_summary = "";
    }
    SummarizerManager.prototype.getSentiment = function () {
        var self = this;
        var Analyzer = require("natural").SentimentAnalyzer;
        var stemmer = require("natural").PorterStemmer;
        var analyzer = new Analyzer("English", stemmer, "afinn");
        return analyzer.getSentiment(self.string.split(" "));
    };
    SummarizerManager.prototype.getFrequencyReduction = function () {
        if (this.frequency_summary == "") {
            this.frequency_summary = this.getSummaryByFrequency().summary;
        }
        var dec = 1 - this.frequency_summary.length / this.string.length;
        var string_dec = String(dec);
        return {
            reduction: string_dec.slice(2, 4) + "." + string_dec.slice(4, 5) + "%",
            summary: this.frequency_summary
        };
    };
    SummarizerManager.prototype.getRankReduction = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dec, string_dec;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.rank_summary == "")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getSummaryByRank()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        dec = 1 - this.rank_summary.length / this.string.length;
                        string_dec = String(dec);
                        return [2 /*return*/, {
                                reduction: string_dec.slice(2, 4) + "." + string_dec.slice(4, 5) + "%",
                                summary: this.rank_summary
                            }];
                }
            });
        });
    };
    SummarizerManager.prototype.getRankReductionAsDec = function () {
        return __awaiter(this, void 0, void 0, function () {
            var dec;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.rank_summary == "")) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.getSummaryByRank()];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        dec = 1 - this.rank_summary.length / this.string.length;
                        return [2 /*return*/, {
                                dec_reduction: dec,
                                summary: this.rank_summary
                            }];
                }
            });
        });
    };
    SummarizerManager.prototype.getFrequencyReductionAsDec = function () {
        if (this.frequency_summary == "") {
            this.frequency_summary = this.getSummaryByFrequency().summary;
        }
        var dec = 1 - this.frequency_summary.length / this.string.length;
        return {
            dec_reduction: dec,
            summary: this.frequency_summary
        };
    };
    SummarizerManager.prototype.getSummaryByFrequency = function () {
        try {
            var summarizer = new Summarizer(this.string, this.number_of_sentences);
            var summary_obj = summarizer.summarizeByFrequency();
            this.frequency_summary = summary_obj.summary;
            if (summary_obj.summary == "") {
                (summary_obj.summary = Error("Not Enough similarities to be summarized, or the sentence is invalid.")),
                    (summary_obj.sentence_list = Error("Not enough similarities to be summarized, or the sentence is invalid."));
            }
            return summary_obj;
        }
        catch (err) {
            return Error("An invalid sentence was entered");
        }
    };
    SummarizerManager.prototype.getSummaryByRank = function () {
        return __awaiter(this, void 0, void 0, function () {
            var summarizer, summary_obj, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        summarizer = new Summarizer(this.string, this.number_of_sentences);
                        return [4 /*yield*/, summarizer.summarizeByRank()];
                    case 1:
                        summary_obj = _a.sent();
                        if (typeof summary_obj.summary === "undefined" ||
                            summary_obj.summary == "") {
                            (summary_obj.summary = Error("Not Enough similarities to be summarized, or the sentence is invalid.")),
                                (summary_obj.sentence_list = Error("Not enough similarities to be summarized, or the sentence is invalid."));
                        }
                        this.rank_summary = summary_obj.summary;
                        return [2 /*return*/, summary_obj];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, Error("An invalid sentence was entered")];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return SummarizerManager;
}());
module.exports = SummarizerManager;
