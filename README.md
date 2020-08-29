# nativescript-fast-android-r

In {N}, querying `android.R`, like using `android.R.integer.config_longAnimTime`, will cause an UI lag for over 500ms the first time it's called. `R` is a big class with many child static classes, so yhis slowdown may be because {N} loads all the `R` class metadata at runtime.

This plugin provides the proxy object `androidR` that uses [Reflection](https://docs.oracle.com/javase/8/docs/technotes/guides/reflection/index.html) to query the static class `integer` and field `config_longAnimTime` to return the value.

## Installation

```javascript
tns plugin add nativescript-fast-android-r
```

## Usage 

To use this plugin, simply import `androidR` and use it like you'd use `android.R`
	
	```typescript
    import { androidR } from "nativescript-fast-android-r";
    console.log(androidR.integer.config_longAnimTime);
    ```


## Peformance

Querying `android.R` for the first time takes usually from 400-800ms, and a negligible time from then onwards.

```
console.log(android.R.integer.config_longAnimTime); // 400-800ms
console.log(android.R.integer.config_longAnimTime); // ~0ms
console.log(android.R.integer.config_shortAnimTime); // ~0ms
console.log(android.R.integer.config_shortAnimTime); // ~0ms
console.log(android.R.transition.explode); // ~0ms
console.log(android.R.transition.explode); // ~0ms
```

`fast-android-r` caches all classes and values that are queried. The first query usually takes <5ms. Subsequent queries to the same value will take negligible time (O(1) lookup). First time queries to other fields/classes usually take <2ms.

```
console.log(androidR.integer.config_longAnimTime); // 0-4ms
console.log(androidR.integer.config_longAnimTime); // ~0ms
console.log(androidR.integer.config_shortAnimTime); // 0-2ms
console.log(androidR.integer.config_shortAnimTime); // ~0ms
console.log(androidR.transition.explode); // 0-4ms
console.log(androidR.transition.explode); // ~0ms
```

### Future possibilities

WAlthough some values from the `R` class are dynamic (e.g.: resources, strings, etc), most of them are not (`integer.config_longAnimTime`, `integer.config_longAnimTime` and others defined in the [documentation](https://developer.android.com/reference/android/R)). It may be benefitial to preload immutable values into the cache while allowing "dynamic" values to be queried.

    
## License

Apache License Version 2.0, January 2004
