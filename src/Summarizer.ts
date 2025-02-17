const Preprocesser = require("./Preprocesser").Preprocesser;

class Summarizer {
  preprocesser: any;
  number_of_sentences: any;
  string_to_process: any;
  new_length: number;
  constructor(string_to_process: any, number_of_sentences: any) {
    this.preprocesser = new Preprocesser();
    this.number_of_sentences = number_of_sentences;
    this.string_to_process = string_to_process;
    this.new_length = 0;
  }

  //Takes in a list of sentences and weights and sorts by weight.
  sortSentences(sentence_weights_list: any[]) {
    sentence_weights_list.sort((a: number[], b: number[]) => {
      return b[0] - a[0];
    });
    return sentence_weights_list;
  }

  //Converts the textRank map into a list
  textRankMapToList(text_rank_map: any[]) {
    let result_list: any[][] = [];
    text_rank_map.forEach((value: any, key: any, map: any) => {
      result_list.push([value, key]);
    });

    return result_list;
  }

  //Takes in a list of sorted sentences and a map of those sentences to the original sentences. Returns a string of the entire summary
  summaryToString(
    sorted_sentences: string | any[],
    clean_sentences: { get: (arg0: any) => string }[]
  ) {
    const self = this;
    let result_string = "";
    let length_count = 0;
    let count = self.number_of_sentences;
    if (sorted_sentences.length < self.number_of_sentences) {
      count = sorted_sentences.length;
    }
    for (var i = 0; i < count; i++) {
      length_count += sorted_sentences[i][1].split(" ").length;
      result_string += clean_sentences[1].get(sorted_sentences[i][1]);
    }
    this.new_length = length_count;
    return result_string;
  }
  // Takes in a list of sorted sentences and a map of those sentences to the original sentences. Returns an array of summarized sentences.
  summaryToArray(
    sorted_sentences: string | any[],
    clean_sentences: { get: (arg0: any) => any }[]
  ) {
    const self = this;
    let result_array = [];
    let length_count = 0;
    let count = self.number_of_sentences;
    if (sorted_sentences.length < self.number_of_sentences) {
      count = sorted_sentences.length;
    }
    for (var i = 0; i < count; i++) {
      length_count += sorted_sentences[i][1].split(" ").length;
      result_array.push(clean_sentences[1].get(sorted_sentences[i][1]));
    }
    this.new_length = length_count;
    return result_array;
  }

  summarizeByFrequency() {
    const self = this;
    const list_to_clean = self.preprocesser.paragraphToSentences(
      self.string_to_process
    );
    const clean_sentences = self.preprocesser.cleanSentences(list_to_clean);
    const tokenized = self.preprocesser.tokenizeSentences(clean_sentences[0]);
    const weighted_map = self.preprocesser.getWeights(tokenized);
    const sentence_weights_list = self.preprocesser.sentenceWeights(
      clean_sentences[0],
      weighted_map
    );
    const sorted_sentences = self.sortSentences(sentence_weights_list);

    return {
      summary: self.summaryToString(sorted_sentences, clean_sentences),
      summaryArray: self.summaryToArray(sorted_sentences, clean_sentences),
      sentence_list: list_to_clean,
      weighted_map: weighted_map,
      sorted_sentences: sorted_sentences,
    };
  }

  async summarizeByRank() {
    const self = this;
    const list_to_clean = self.preprocesser.paragraphToSentences(
      self.string_to_process
    );
    const clean_sentences = self.preprocesser.cleanSentences(list_to_clean);
    try {
      const nouns_and_adjective_map =
        await self.preprocesser.nounsAndAdjectives(clean_sentences[0]);
      let text_rank_graph = self.preprocesser.createTextRankGraph(
        nouns_and_adjective_map
      );
      let text_rank_map = self.preprocesser.textRank(text_rank_graph);
      let text_rank_list = self.sortSentences(
        self.textRankMapToList(text_rank_map)
      );
      return {
        summary: self.summaryToString(text_rank_list, clean_sentences),
        summaryArray: self.summaryToArray(text_rank_list, clean_sentences),
        sentence_list: list_to_clean,
        nouns_and_adjective_map: nouns_and_adjective_map,
      };
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports.Summarizer = Summarizer;
