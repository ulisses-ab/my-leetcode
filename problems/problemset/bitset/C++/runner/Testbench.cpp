#include <bits/stdc++.h>
#include <nlohmann/json.hpp>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>

using json = nlohmann::json;

class Bitset;

int main() {
    std::string testcase_str;
    std::cin >> testcase_str;

    json testcase = json::parse(testcase_str);

    auto input = testcase["input"];
    int target = testcase["input"]["target"].get<int>();

    for (auto step : input) {
        auto method = step[0].get<std::string>();
        
        if (method == "shiftLeft") {

        }
        else if (method == "shiftRight") {

        }
        else if (method == "set") {

        }
        else if (method == "and") {

        }
        else if (method == "or") {

        }
        else if (method == "xor") {
            
        }
        Bitset.shift();
    }


    std::cout << "__BEGIN_RESULT__" << output.dump() << "__END_RESULT__";
}
