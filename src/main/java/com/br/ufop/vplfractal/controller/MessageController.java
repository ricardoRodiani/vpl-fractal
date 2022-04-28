package com.br.ufop.vplfractal.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.rmi.ServerException;

@RestController
@ResponseBody
@RequestMapping("/api/")
public class MessageController {
    @PostMapping("/fractal")
    public ResponseEntity<String> postBody(@RequestBody String fractal) throws ServerException {
        if (fractal == null){
            throw new ServerException("Expected a body");
        } else {
            return new ResponseEntity<>(fractal, HttpStatus.ACCEPTED);
        }
    }
}
