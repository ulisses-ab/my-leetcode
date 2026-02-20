#include <bits/stdc++.h>
#include <nlohmann/json.hpp>
#include <stdio.h>
#include <unistd.h>
#include <stdlib.h>
#include "../code/Map.h"    
#include <ctime>

using json = nlohmann::json;

int main() {
    std::string testcase_str((std::istreambuf_iterator<char>(std::cin)),
                      std::istreambuf_iterator<char>());

    json testcase = json::parse(testcase_str);

    auto input = testcase["input"].get<std::string>();
    
    std::stringstream input_stream(input);
    std::string instruction;

    Map* map = new Map();

    std::string output = "";

    clock_t start = clock();

    int a = 0;
    while (input_stream >> instruction)  {
        std::cout << a++ << std::endl;
        if (instruction == "GET") {
            std::string key;
            input_stream >> key;

            auto str = map->get(key);

            output += (str.size() == 0 ? std::string("\"\"") : str) + "\n";
        }
        else if (instruction == "SET") {
            std::string key, val;
            input_stream >> key >> val;

            map->set(key, val);
        }
        else {
            output += std::to_string(map->size()) + "\n";
        }
    }

    clock_t end = clock();
    double cpu_seconds = double(end - start) / CLOCKS_PER_SEC;

    json out;
    
    out["actual_output"] = output;
    out["time_ms"] = cpu_seconds * 1000;

    std::cout << "__BEGIN_RESULT__" << out.dump() << "__END_RESULT__";
}
