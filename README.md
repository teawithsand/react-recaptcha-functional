# react-recaptcha-functional

Another recaptcha V2 implementation for react.

## Is it production ready?
Dunno, but I am going to use it, since it's open source rewrite/port of small component that I've been already using for a while.

## Usage
See example/src/app.tsx

## Why?
Because other implementations are use class-style component.
This one uses functional-style components and in general is some  example of how to integrate external library into react
using hooks(yes, it could be jquery plugin instead of recaptcha).

Also this implementation allows timeout-based loop to wait before recaptcha scripts gets loaded.
In general it's bad idea to use it, however it requires zero configuration of recaptcha script. Just include it and it works.

## Testing
In general for testing use example. It's quite hard to write some reasonable testing aside from that.
Selenium could help for automatization, but it's not worth it IMO.

## V3 support
Recaptcha V3 is quite easy to use with react even without custom lib, so I won't wrap it in this library.