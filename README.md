# react-recaptcha-functional

Another recaptcha v2 implementation for react.

## Why?
Because other implementations are compatibile with old react, and use class-style component.
This one uses functional-style components and in general is good and simple example of how to integrate external library into react
using hooks.

Also this implementation allows timeout-based loop to wait before recaptcha scripts gets loaded.
In general it's bad idea to use it, however it requires zero configuration of recaptcha script. Just include it and it works.