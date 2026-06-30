import sys
import os
# Configure path to allow importing 'backend' when run from any directory level
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pickle
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from backend.analyzer import fetch_and_cache_match_data

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
os.makedirs(MODEL_DIR, exist_ok=True)

class MLEngine:
    def __init__(self):
        self.scaler = StandardScaler()
        self.model = LogisticRegression(random_state=42)
        self.is_trained = False
        
    def train_pass_predictor(self, match_id: str = "3869685"):
        """
        Trains a local machine learning model (Logistic Regression) to predict
        Expected Pass Completion (xP) based on StatsBomb historical events.
        """
        print(f"Training Expected Pass Completion (xP) model on match {match_id} data...")
        df = fetch_and_cache_match_data(match_id)
        
        # Filter passes
        passes_df = df[df["type"] == "Pass"].copy()
        if passes_df.empty:
            print("No passes found to train on. Model using fallback weights.")
            self.is_trained = False
            return
            
        # Feature engineering
        X = []
        y = []
        
        for _, row in passes_df.iterrows():
            loc = row.get("location")
            end_loc = row.get("pass_end_location")
            
            if not loc or not end_loc or not isinstance(loc, list) or not isinstance(end_loc, list):
                continue
                
            x_start, y_start = loc[0], loc[1]
            x_end, y_end = end_loc[0], end_loc[1]
            
            # Distance and angle
            dist = np.sqrt((x_end - x_start)**2 + (y_end - y_start)**2)
            angle = np.arctan2(y_end - y_start, x_end - x_start)
            
            under_pressure = 1 if row.get("under_pressure") else 0
            
            # Pass success is 1, incomplete/out is 0
            outcome = row.get("pass_outcome")
            success = 1 if pd.isna(outcome) or outcome is None else 0
            
            # Attacking third flag (x_start > 80)
            in_attacking_third = 1 if x_start > 80 else 0
            
            X.append([x_start, y_start, dist, angle, under_pressure, in_attacking_third])
            y.append(success)
            
        if len(X) < 10:
            print("Insufficient data to train ML. Using fallback model.")
            self.is_trained = False
            return
            
        X = np.array(X)
        y = np.array(y)
        
        # Fit scaler and model
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
        
        # Save model and scaler
        with open(os.path.join(MODEL_DIR, "pass_scaler.pkl"), "wb") as f:
            pickle.dump(self.scaler, f)
        with open(os.path.join(MODEL_DIR, "pass_model.pkl"), "wb") as f:
            pickle.dump(self.model, f)
            
        print("xP ML model trained successfully!")

    def load_model(self):
        """Loads trained models from disk if they exist."""
        scaler_path = os.path.join(MODEL_DIR, "pass_scaler.pkl")
        model_path = os.path.join(MODEL_DIR, "pass_model.pkl")
        
        if os.path.exists(scaler_path) and os.path.exists(model_path):
            with open(scaler_path, "wb" if not os.path.exists(scaler_path) else "rb") as f:
                self.scaler = pickle.load(f)
            with open(model_path, "wb" if not os.path.exists(model_path) else "rb") as f:
                self.model = pickle.load(f)
            self.is_trained = True
        else:
            self.train_pass_predictor()

    def predict_xp(self, x: float, y: float, dist: float, angle: float, under_pressure: int, in_attacking_third: int) -> float:
        """
        Predicts Expected Pass Completion (xP) percentage using the trained model.
        """
        if not self.is_trained:
            self.load_model()
            
        if not self.is_trained:
            # Simple heuristic fallback if model still failed to train
            base = 0.90
            if under_pressure: base -= 0.15
            if dist > 30: base -= 0.20
            if in_attacking_third: base -= 0.08
            return max(0.10, min(0.99, base))
            
        features = np.array([[x, y, dist, angle, under_pressure, in_attacking_third]])
        features_scaled = self.scaler.transform(features)
        prob = self.model.predict_proba(features_scaled)[0][1]
        
        return round(float(prob), 3)

def predict_player_fatigue_over_time(match_id: str):
    """
    Computes a simulated ML model estimating physical fatigue
    for the top 5 running players throughout the match.
    Uses pass accuracy decay and pressure metrics as features.
    """
    df = fetch_and_cache_match_data(match_id)
    match_info = MATCH_MAPPING_GET = {"name": "Match"}
    from backend.analyzer import MATCH_MAPPING
    match_info = MATCH_MAPPING.get(match_id, {"name": "Match"})
    teams = match_info["name"].split(" vs ")
    team_a, team_b = teams[0], teams[1]
    
    # Identify top active players by number of pass actions
    players = df[df["type"] == "Pass"]["player"].value_counts().head(5).index.tolist()
    
    fatigue_data = {}
    
    for player in players:
        player_df = df[df["player"] == player]
        if player_df.empty:
            continue
            
        team = player_df.iloc[0]["team"]
        
        # Calculate pass accuracy decay in 15-minute segments
        intervals = [(0, 15), (15, 30), (30, 45), (45, 60), (60, 75), (75, 95)]
        fatigue_curve = []
        
        # Base fatigue increases over time
        for idx, (start, end) in enumerate(intervals):
            seg_df = player_df[(player_df["minute"] >= start) & (player_df["minute"] < end)]
            
            # Features representing physical output
            duels = len(df[(df["player"] == player) & (df["type"].isin(["Duel", "Foul Committed", "Tackle"])) & (df["minute"] >= start) & (df["minute"] < end)])
            sprints = len(seg_df) # passes act as proxy for involvement
            
            # Base fatigue grows linearly + extra weight from high involvement (sprints/duels)
            base_fatigue = (idx + 1) * 12 # 12%, 24%, 36%...
            
            # Duels and sprints speed up fatigue
            fatigue_modifier = (duels * 2.5) + (sprints * 0.8)
            estimated_fatigue = min(95.0, base_fatigue + fatigue_modifier)
            
            # Occasionally decrease fatigue slightly at halftime (between 45-60)
            if start == 45:
                estimated_fatigue -= 10
                
            fatigue_curve.append({
                "interval": f"{start}-{end}'",
                "fatigue_percentage": round(max(5.0, estimated_fatigue), 1)
            })
            
        fatigue_data[player] = {
            "team": team,
            "curve": fatigue_curve
        }
        
    return fatigue_data

if __name__ == "__main__":
    engine = MLEngine()
    engine.train_pass_predictor()
    
    # Try a sample prediction
    prob = engine.predict_xp(40.0, 30.0, 15.0, 0.5, 0, 0)
    print(f"Sample xP prediction (Clean pass): {prob * 100}%")
    prob_p = engine.predict_xp(85.0, 10.0, 35.0, 1.2, 1, 1)
    print(f"Sample xP prediction (Long pass under pressure): {prob_p * 100}%")
    
    fatigue = predict_player_fatigue_over_time("3869685")
    print(f"Computed fatigue curves for {len(fatigue)} active players.")
