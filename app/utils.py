import pandas as pd
from sklearn.preprocessing import StandardScaler

def preprocess_input(df: pd.DataFrame, feature_columns: list, scaler: StandardScaler):
    # Limit cardinality for object columns
    for col in df.select_dtypes(include=['object']):
        top_vals = df[col].value_counts().nlargest(20).index
        df[col] = df[col].where(df[col].isin(top_vals), other='Other')

    # One-hot encode
    X_encoded = pd.get_dummies(df)
    X_encoded = X_encoded.reindex(columns=feature_columns, fill_value=0)

    # Scale
    return scaler.transform(X_encoded)
